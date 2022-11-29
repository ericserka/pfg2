import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  Accuracy,
  getCurrentPositionAsync,
  watchPositionAsync,
} from 'expo-location'
import { Center, IconButton, Image, Text } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import MapView, {
  MAP_TYPES,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from 'react-native-maps'
import {
  COLOR_PRIMARY_600,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../constants'
import { useUserAuth } from '../store/auth/provider'
import { useUserLocation } from '../store/location/provider'
import { CenterLoading } from '../components/loading/CenterLoading'
import { useWebSocket } from '../store/websocket/provider'
import { useUserGroup } from '../store/groups/provider'
import { log } from '@pfg2/logger'

export const Map = () => {
  const { navigate } = useNavigation()
  const mapRef = useRef(null)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })

  const {
    actions: { getUserPosition },
  } = useUserLocation()
  const {
    actions: { emitEventLocationChanged, listenToLocationChanged },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()
  const {
    state: { current },
    actions: { updateCurrentGroup },
  } = useUserGroup()

  const setCurrentLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await getCurrentPositionAsync({
      accuracy: Accuracy.BestForNavigation,
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

  useEffect(() => {
    let watchId = null

    async function watchPosition() {
      watchId = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords
          setLocation((defaultLocation) => ({
            ...defaultLocation,
            latitude,
            longitude,
          }))
          emitEventLocationChanged({
            userId: session.id,
            position: {
              latitude,
              longitude,
            },
          })
        }
      )
    }

    watchPosition()

    listenToLocationChanged((message) => {
      log.info(`[${session.username}] received location update event`, message)
      message.userId !== session.id &&
        updateCurrentGroup({
          members: current.members.map((u) =>
            u.id === message.userId
              ? {
                  ...u,
                  position: {
                    lat: message.position.latitude,
                    lng: message.position.longitude,
                  },
                }
              : u
          ),
        })
    })

    return () => {
      watchId?.remove()
    }
  }, [])

  const center = async () => {
    mapRef?.current?.animateToRegion(await getUserPosition(), 1500)
  }

  const markers = [
    ...(current?.members ?? []),
    {
      ...session,
      position: {
        lat: location.latitude,
        lng: location.longitude,
      },
    },
  ].map(
    (u) =>
      u?.position?.lat &&
      u?.position?.lng && (
        <Marker
          key={`marker_${u.position.lat}_${u.position.lng}`}
          identifier={`${u.id}`}
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
                uri: u.profilePic,
              }}
              w="10"
              h="10"
              rounded="full"
              alt={`icon for user ${u.id}`}
            />
            <Text fontWeight="semibold">{u.username}</Text>
          </Center>
        </Marker>
      )
  )

  if (!location.latitude || !location.longitude) {
    return <CenterLoading />
  }

  return (
    <>
      <MapView
        ref={mapRef}
        initialRegion={location}
        loadingEnabled={!location.latitude || !location.longitude}
        onMapReady={center}
        userLocationPriority="high"
        style={{ flex: 1 }}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        showsUserLocation={false}
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
        icon={
          <FontAwesome5 name="crosshairs" size={30} color={COLOR_PRIMARY_600} />
        }
      />
      <IconButton
        onPress={() => navigate('Chat')}
        position="absolute"
        right="3"
        top="24"
        rounded="full"
        icon={
          <FontAwesome5
            name="user-friends"
            size={25}
            color={COLOR_PRIMARY_600}
          />
        }
      />
    </>
  )
}
