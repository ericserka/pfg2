import {
  Accuracy,
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  LocationAccuracy,
} from 'expo-location'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'
import { userLocationReducer } from './reducer'

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
    state: { session },
  } = useUserAuth()

  const {
    actions: { emitEventLocationChanged },
  } = useWebSocket()

  useEffect(() => {
    getEmergencyMarkers()
  }, [])

  const sendLastPosition = async () => {
    const position = await getUserPosition()
    emitEventLocationChanged({
      userId: session.id,
      position,
      lastKnownPosition: true,
    })
  }

  const calculateRegion = (
    lat,
    long,
    accuracy = Accuracy.BestForNavigation
  ) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const latDelta = accuracy / oneDegreeOfLatitudeInMeters
    const longDelta =
      accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)))

    return {
      latitude: lat,
      longitude: long,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
      accuracy,
    }
  }

  const getUserPosition = async () => {
    const loc = await getLastKnownPositionAsync()

    if (!loc) return null

    return calculateRegion(loc.coords.latitude, loc.coords.longitude)
  }

  const getCurrentPosition = async () => {
    const loc = await getCurrentPositionAsync({
      accuracy: LocationAccuracy.Highest,
    })

    if (!loc) return null

    return calculateRegion(loc.coords.latitude, loc.coords.longitude)
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
          calculateRegion,
          sendLastPosition,
        },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}
