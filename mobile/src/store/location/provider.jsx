import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  LocationAccuracy,
} from 'expo-location'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { dayjs } from '../../helpers/dayjs'
import { api } from '../../services/api/axios'
import { useUsers } from '../user/provider'
import { userLocationReducer } from './reducer'

const locationObjectToLiteral = (loc) => ({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
})

const userLocationInitialState = {
  markers: [],
  error: null,
}

const UserLocationContext = createContext({
  state: { ...userLocationInitialState },
})

export const useUserLocation = () => useContext(UserLocationContext)

export const UserLocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    userLocationReducer,
    userLocationInitialState
  )

  const {
    actions: { updateUser },
  } = useUsers()

  useEffect(() => {
    getEmergencyMarkers()

    return () => {
      sendLastPosition()
    }
  }, [])

  const sendLastPosition = async () => {
    const { latitude, longitude } = await getUserPosition()
    await updateUser({
      lastKnownLatitude: latitude,
      lastKnownLongitude: longitude,
      lastKnownLocationUpdatedAt: dayjs().toDate(),
    })
  }

  const getUserPosition = async () => {
    const loc = await getLastKnownPositionAsync()

    if (!loc) return null

    return {
      ...locationObjectToLiteral(loc),
      latitudeDelta: 0.003,
      longitudeDelta: 0.002,
    }
  }

  const getCurrentPosition = async () => {
    const loc = await getCurrentPositionAsync({
      accuracy: LocationAccuracy.Highest,
    })

    if (!loc) return null

    return {
      ...locationObjectToLiteral(loc),
      latitudeDelta: 0.003,
      longitudeDelta: 0.002,
    }
  }

  const getEmergencyMarkers = async () => {
    try {
      toggleMutationLoading(dispatch)
      const { data } = await api.get('/notifications/emergency-locations')
      dispatch({ type: 'SET_MARKERS', payload: data })
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const updateEmergencyMarkers = (markers) => {
    dispatch({ type: 'UPDATE_MARKERS', payload: markers })
  }

  return (
    <UserLocationContext.Provider
      value={{
        state,
        actions: {
          getUserPosition,
          getCurrentPosition,
          getEmergencyMarkers,
          updateEmergencyMarkers,
        },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}
