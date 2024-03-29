import { FontAwesome } from '@expo/vector-icons'
import {
  Accuracy,
  getCurrentPositionAsync,
  watchPositionAsync,
} from 'expo-location'
import { Center, IconButton, Image, Text } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import MapView from 'react-native-map-clustering'
import { Circle, MAP_TYPES, Marker, PROVIDER_DEFAULT } from 'react-native-maps'
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

export const Map = () => {
  const mapRef = useRef(null)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    accuracy: Accuracy.BestForNavigation,
    updatedAt: null,
  })
  const [mode, setMode] = useState('group')

  const {
    actions: { getUserPosition, calculateRegion },
  } = useUserLocation()
  const {
    actions: {
      emitEventLocationChanged,
      listenToLocationChanged,
      unlistenToLocationChanged,
    },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()
  const {
    state: { current },
    actions: { receiveLocationUpdate },
  } = useUserGroup()
  const {
    state: { markers: emergencyMarkers },
  } = useUserLocation()

  const [followingUser, setFollowingUser] = useState(session.id)
  const [membersToRender, setMembersToRender] = useState([])
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    setMembersToRender(
      current?.members ?? [
        {
          ...session,
          position: {
            lat: location.latitude,
            lng: location.longitude,
          },
          lastKnownLocationUpdatedAt: location.updatedAt,
        },
      ]
    )
  }, [current, session, location])

  const [trackView, setTrackView] = useState({})

  useEffect(() => {
    setTrackView(
      membersToRender.reduce(
        (acc, _cur, idx) => ({
          ...acc,
          [idx]: true,
        }),
        {}
      )
    )
  }, [membersToRender])

  const setCurrentLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await getCurrentPositionAsync({
      accuracy: Accuracy.BestForNavigation,
    })
    setLocation({
      ...calculateRegion(latitude, longitude),
      updatedAt: dayjs().toDate(),
    })
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
        ({ coords: { latitude, longitude }, timestamp }) => {
          if (followingUser === session.id) {
            setLocation({
              ...calculateRegion(latitude, longitude),
              updatedAt: dayjs(timestamp).toDate(),
            })
          }
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
      receiveLocationUpdate(message)
      if (followingUser !== session.id && followingUser === message.userId) {
        mapRef?.current?.animateToRegion(
          calculateRegion(
            message.position.latitude,
            message.position.longitude
          ),
          1500
        )
      }
    })

    return () => {
      unlistenToLocationChanged()
    }
  }, [receiveLocationUpdate])

  const center = async () => {
    mapRef?.current?.animateToRegion(await getUserPosition(), 1500)
  }

  const markersRefs = useRef([])

  useEffect(() => {
    setMarkers(
      mode === 'group'
        ? membersToRender.map((u, i) => {
            const isTheAuthenticatedUser = u.id === session.id
            const username = isTheAuthenticatedUser ? 'Eu' : u.username
            const isBeingFollowed =
              followingUser === u.id && followingUser !== session.id

            if (isBeingFollowed) {
              markersRefs.current[i]?.showCallout()
            }

            return (
              <Marker
                key={`marker_${u.id}_${u.position.lat}_${u.position.lng}`}
                ref={(el) => (markersRefs.current[i] = el)}
                identifier={`${u.id}`}
                title={username}
                description={`${dayjs(
                  u?.lastKnownLocationUpdatedAt ?? undefined
                ).format('lll')}`}
                coordinate={{
                  latitude: u.position.lat,
                  longitude: u.position.lng,
                }}
                tracksInfoWindowChanges={false}
                tracksViewChanges={trackView[i]}
                pointerEvents="auto"
                onSelect={() => {
                  if (u.id !== session.id) {
                    mapRef?.current?.animateToRegion(
                      calculateRegion(u.position.lat, u.position.lng),
                      1500
                    )
                    setFollowingUser(u.id)
                  }
                }}
                onDeselect={() => setFollowingUser(session.id)}
              >
                <Center>
                  <Image
                    onLoadEnd={() =>
                      setTrackView((prevState) => ({
                        ...prevState,
                        [i]: false,
                      }))
                    }
                    source={{
                      uri: u.profilePic,
                    }}
                    w={isBeingFollowed ? '16' : '12'}
                    h={isBeingFollowed ? '16' : '12'}
                    rounded="full"
                    borderWidth={
                      isTheAuthenticatedUser || isBeingFollowed ? 3 : undefined
                    }
                    borderColor={
                      isTheAuthenticatedUser
                        ? 'primary.600'
                        : isBeingFollowed
                        ? 'green.600'
                        : undefined
                    }
                    alt={`icon for user ${u.id}`}
                  />
                  <Text
                    color={isTheAuthenticatedUser ? 'primary.600' : undefined}
                    fontWeight="semibold"
                  >
                    {username}
                  </Text>
                </Center>
              </Marker>
            )
          })
        : emergencyMarkers.map((loc) => (
            <Marker
              key={`marker_${loc.id}_${loc.latitude}_${loc.longitude}`}
              identifier={`${loc.id}`}
              title={'Pedido de Ajuda'}
              description={`${dayjs(loc?.createdAt).format('lll')}`}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
            />
          ))
    )
  }, [
    mode,
    membersToRender,
    session,
    followingUser,
    markersRefs,
    trackView,
    mapRef,
  ])

  const shapes =
    mode === 'group'
      ? []
      : emergencyMarkers.map((loc) => (
          <Circle
            key={`circle_${loc.id}_${loc.latitude}_${loc.longitude}`}
            center={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            radius={6}
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
        ))

  useEffect(() => {
    markersRefs.current = markersRefs.current.slice(0, markers.length)
  }, [markers])

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
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        zoomControlEnabled={false}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        clusteringEnabled={mode === 'riskAreas'}
        clusterColor="#FF1111"
        preserveClusterPressBehavior={true}
      >
        {markers}
        {shapes}
      </MapView>
      <IconButton
        onPress={center}
        position="absolute"
        right="3"
        bottom="12"
        rounded="full"
        icon={
          <FontAwesome name="crosshairs" size={30} color={COLOR_PRIMARY_600} />
        }
      />
      <IconButton
        onPress={() =>
          setMode((prevMode) =>
            prevMode === 'riskAreas' ? 'group' : 'riskAreas'
          )
        }
        position="absolute"
        right="3"
        top="24"
        rounded="full"
        icon={
          <FontAwesome
            name={mode === 'riskAreas' ? 'group' : 'exclamation-triangle'}
            size={25}
            color={COLOR_PRIMARY_600}
          />
        }
      />
    </>
  )
}
