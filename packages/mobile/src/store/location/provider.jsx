import { getLastKnownPositionAsync } from 'expo-location'
import { createContext, useContext, useReducer } from 'react'
import { userLocationReducer } from './reducer'
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../../constants'

const locationObjectToLiteral = (loc) => ({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
})

export const initialRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const userLocationInitialState = {
  markers: [],
  error: null,
}

const UserLocationContext = createContext({
  locationState: { ...userLocationInitialState },
})

export const useUserLocation = () => useContext(UserLocationContext)

export const UserLocationProvider = ({ children }) => {
  const [locationState, dispatch] = useReducer(
    userLocationReducer,
    userLocationInitialState
  )

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
        locationState,
        locationActions: { getUserPosition },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}
