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
import { log } from '../../helpers/logger'
import { usePushNotifications } from '../../hooks/usePushNotifications'
import { Emergency } from '../../screens/Emergency'
import { Notifications } from '../../screens/Notifications'
import { useUserAuth } from '../../store/auth/provider'
import { useUserGroup } from '../../store/groups/provider'
import { useNotifications } from '../../store/notifications/provider'
import { useWebSocket } from '../../store/websocket/provider'
import { LoadedProviders } from '../loading/LoadedProviders'
import { GroupSelector } from '../navbar/group-actions/GroupSelector'
import { Left } from '../navbar/Left'
import { Right } from '../navbar/Right'
import { HomeStack } from './HomeStack'

const Tab = createBottomTabNavigator()

export const BottomTabs = () => {
  const {
    state: { non_read_notifications_amount },
    actions: { onNotificationReceived },
  } = useNotifications()
  const {
    actions: {
      listenToNotificationReceived,
      unlistenToNotificationReceived,
      listenToMessageAdded,
      unlistenToMessageAdded,
    },
  } = useWebSocket()
  const {
    state: { session },
  } = useUserAuth()
  const {
    actions: { receiveChatMessage, onRemovedFromGroup },
  } = useUserGroup()
  const { registerForPushNotificationsAsync, handlePushNotificationsResponse } =
    usePushNotifications()

  const { getCurrentRoute } = useNavigation()

  useEffect(() => {
    listenToNotificationReceived(
      ({ notifications, emergencyLocation, removedFromGroup }) => {
        const notification = notifications.find(
          (n) => n.receiverId === session.id
        )
        if (notification) {
          log.info(
            `[${session.username}] received a notification`,
            notification
          )
          onNotificationReceived({ notification, emergencyLocation })
          if (removedFromGroup) {
            log.info(
              `[${session.username}] was removed from group of id ${removedFromGroup}`
            )
            onRemovedFromGroup({ groupId: removedFromGroup })
          }
        }
      }
    )
    return () => {
      unlistenToNotificationReceived()
    }
  }, [onRemovedFromGroup, onNotificationReceived])

  useEffect(() => {
    listenToMessageAdded((message) => {
      log.info(`[${session.username}] received message event`, {
        ...message,
        sender: message.sender.username,
      })
      receiveChatMessage(message)
    })

    return () => {
      unlistenToMessageAdded()
    }
  }, [receiveChatMessage])

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
          name="Mapa"
          options={{
            headerTransparent: true,
            headerTitle: (props) =>
              ['Mapa', 'Chat', 'Home'].includes(getCurrentRoute()?.name) ? (
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
            tabBarBadge: non_read_notifications_amount || null,
          }}
          component={Notifications}
        />
      </Tab.Navigator>
    </LoadedProviders>
  )
}
