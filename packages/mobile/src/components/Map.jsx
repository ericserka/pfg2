import { FontAwesome5 } from '@expo/vector-icons'
import { Accuracy, getCurrentPositionAsync } from 'expo-location'
import { Center, IconButton, Image, Text } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import MapView, {
  MAP_TYPES,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from 'react-native-maps'
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../constants'
import { useUserAuth } from '../store/auth/provider'
import { useUserLocation } from '../store/location/provider'
import { LoadingInterceptor } from './loading/LoadingInterceptor'

export const Map = ({ group }) => {
  const mapRef = useRef(null)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })

  const {
    locationActions: { getUserPosition },
  } = useUserLocation()

  const {
    state: { session },
  } = useUserAuth()

  const setCurrentLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await getCurrentPositionAsync({
      accuracy: Accuracy.Highest,
      maximumAge: 50,
    })
    setLocation((defaultLocation) => ({
      ...defaultLocation,
      latitude,
      longitude,
    }))
  }

  useEffect(() => {
    setCurrentLocation()
  }, [])

  const center = async () => {
    mapRef?.current?.animateToRegion(await getUserPosition(), 1500)
  }

  const markers = group.users.map((u) => (
    <Marker
      key={`marker_${u.position.lat}_${u.position.lng}`}
      identifier={u.id}
      style={{
        width: 100,
        height: 100,
      }}
      title={u.name}
      description={u.email}
      coordinate={{
        latitude: u.position.lat,
        longitude: u.position.lng,
      }}
    >
      <Center>
        <Image
          source={{
            uri: u.avatar_url,
          }}
          w="10"
          h="10"
          rounded="full"
          alt={`icon for user ${u.id}`}
        />
        <Text fontWeight="semibold">{u.name}</Text>
      </Center>
    </Marker>
  ))

  return (
    <LoadingInterceptor extra={[location.latitude === 0]}>
      <MapView
        ref={mapRef}
        initialRegion={location}
        onMapReady={center}
        userLocationPriority="high"
        style={{ flex: 1 }}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        showsUserLocation
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale={false}
        showsTraffic={false}
        maxZoomLevel={17}
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        zoomControlEnabled={false}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers}
      </MapView>
      <IconButton
        onPress={center}
        position="absolute"
        right="3"
        bottom="3"
        rounded="full"
        icon={<FontAwesome5 name="compass" size={30} color="#0047AB" />}
      />
    </LoadingInterceptor>
  )
}
