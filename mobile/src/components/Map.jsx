import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  Accuracy,
  getCurrentPositionAsync,
  watchPositionAsync,
} from 'expo-location'
import { Center, IconButton, Image, Text } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
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
import { dayjs } from '../helpers/dayjs'
import { log } from '../helpers/logger'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useUserLocation } from '../store/location/provider'
import { useWebSocket } from '../store/websocket/provider'
import { LoadingInterceptor } from './loading/LoadingInterceptor'

export const Map = () => {
  const { navigate } = useNavigation()
  const mapRef = useRef(null)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    updatedAt: null,
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
    actions: { receiveLocationUpdate },
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
            updatedAt: location.timestamp,
          }))
          log.info(`[${session.username}] sent location-changed`)
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

    return () => {
      watchId?.remove()
    }
  }, [])

  useEffect(() => {
    setCurrentLocation()

    listenToLocationChanged((message) => {
      log.info(`[${session.username}] received location update event`, message)
      message.userId !== session.id && receiveLocationUpdate(message)
    })
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
      lastKnownLocationUpdatedAt: location.updatedAt,
    },
  ].map(
    (u) =>
      u?.position?.lat &&
      u?.position?.lng && (
        <Marker
          key={`marker_${u.position.lat}_${u.position.lng}`}
          identifier={`${u.id}`}
          title={u.username}
          description={`${dayjs(
            u?.lastKnownLocationUpdatedAt ?? undefined
          ).format('lll')}`}
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
              w="12"
              h="12"
              rounded="full"
              alt={`icon for user ${u.id}`}
            />
            <Text fontWeight="semibold">{u.username}</Text>
          </Center>
        </Marker>
      )
  )

  return (
    <LoadingInterceptor loading={!location.latitude || !location.longitude}>
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
        maxZoomLevel={Platform.OS === 'ios' ? 17 : 20}
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
      {!!current && (
        <IconButton
          onPress={() => navigate('Chat')}
          position="absolute"
          right="3"
          top="24"
          rounded="full"
          icon={
            <FontAwesome5
              name="comment-dots"
              size={25}
              color={COLOR_PRIMARY_600}
            />
          }
        />
      )}
    </LoadingInterceptor>
  )
}