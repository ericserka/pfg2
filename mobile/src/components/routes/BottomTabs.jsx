import { FontAwesome } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import {
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  setNotificationHandler,
} from 'expo-notifications'
import { Text } from 'native-base'
import { useEffect } from 'react'
import { usePushNotifications } from '../../hooks/usePushNotifications'
import { Emergency } from '../../screens/Emergency'
import { Notifications } from '../../screens/Notifications'
import { useUserAuth } from '../../store/auth/provider'
import { useUserGroup } from '../../store/groups/provider'
import { useNotifications } from '../../store/notifications/provider'
import { useWebSocket } from '../../store/websocket/provider'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'
import { GroupSelector } from '../navbar/group-actions/GroupSelector'
import { Left } from '../navbar/Left'
import { Right } from '../navbar/Right'
import { HomeStack } from './HomeStack'

const Tab = createBottomTabNavigator()

const LoadedProviders = ({ children }) => {
  const {
    state: { queryLoading: authLoading },
  } = useUserAuth()
  const {
    state: { queryLoading: groupsLoading },
  } = useUserGroup()

  const loading = [authLoading, groupsLoading].some((l) => l)

  return <LoadingInterceptor loading={loading}>{children}</LoadingInterceptor>
}

export const BottomTabs = () => {
  const {
    state: { non_read_notifications_amount },
    actions: { getNotifications },
  } = useNotifications()
  const {
    actions: { listenToNotificationReceived },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()
  const { registerForPushNotificationsAsync, handlePushNotificationsResponse } =
    usePushNotifications()

  const { getCurrentRoute } = useNavigation()

  useEffect(() => {
    listenToNotificationReceived(({ usersIds }) => {
      if (usersIds.includes(session.id)) {
        getNotifications()
      }
    })
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync()
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    })
    const responseListener = addNotificationResponseReceivedListener(
      handlePushNotificationsResponse
    )
    return () => {
      if (responseListener) {
        removeNotificationSubscription(responseListener)
      }
    }
  }, [])

  return (
    <LoadedProviders>
      <Tab.Navigator
        screenOptions={{
          headerLeft: (props) => <Left {...props} />,
          headerRight: (props) => <Right {...props} />,
          headerShadowVisible: true,
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            headerTitle: (props) =>
              ['Mapa', 'Chat'].includes(getCurrentRoute()?.name) ? (
                <GroupSelector {...props} />
              ) : (
                <Text fontSize="xl" bold>
                  {getCurrentRoute()?.name}
                </Text>
              ),
            tabBarIcon: (props) => <FontAwesome name="map-o" {...props} />,
          }}
          component={HomeStack}
        />
        <Tab.Screen
          name="Emergência"
          options={{
            tabBarIcon: (props) => (
              <FontAwesome name="exclamation-circle" {...props} />
            ),
          }}
          component={Emergency}
        />
        <Tab.Screen
          name="Notificações"
          options={{
            tabBarIcon: (props) => <FontAwesome name="bell-o" {...props} />,
            tabBarBadge: non_read_notifications_amount,
          }}
          component={Notifications}
        />
      </Tab.Navigator>
    </LoadedProviders>
  )
}
