import { getLastKnownPositionAsync } from 'expo-location'
import { createContext, useContext, useReducer, useEffect } from 'react'
import { userLocationReducer } from './reducer'
import { api } from '../../services/api/axios'

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

  useEffect(() => {
    return () => {
      sendLastPosition()
    }
  }, [])

  const sendLastPosition = async () => {
    const position = await getUserPosition()
    await api.post('/users/last-loc', {
      latitude: position.latitude,
      longitude: position.longitude,
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

  return (
    <UserLocationContext.Provider
      value={{
        state,
        actions: { getUserPosition },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}
