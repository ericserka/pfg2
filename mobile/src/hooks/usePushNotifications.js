import { useNavigation } from '@react-navigation/native'
import { isDevice } from 'expo-device'
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications'
import { Alert, Platform } from 'react-native'
import { useUserAuth } from '../store/auth/provider'
import { useUserGroup } from '../store/groups/provider'
import { useNotifications } from '../store/notifications/provider'
import { useUsers } from '../store/user/provider'

export const usePushNotifications = () => {
  const { navigate } = useNavigation()
  const {
    actions: { alterPushToken, alterPushNotificationsAllowance },
  } = useUsers()
  const {
    state: { session },
    actions: { updateSession },
  } = useUserAuth()
  const {
    actions: { onNotificationReceived },
  } = useNotifications()
  const {
    actions: { onRemovedFromGroup },
  } = useUserGroup()

  const registerForPushNotificationsAsync = async () => {
    if (isDevice) {
      const { status: existingStatus } = await getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync()

        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão para notificações',
          'Permissão para notificações não concedida. Considere permitir nas configurações do seu dispositivo e reiniciar o app.'
        )
        await alterPushNotificationsAllowance(false)
        return
      }
      const token = (await getExpoPushTokenAsync()).data
      if (token !== session.pushToken) {
        await alterPushToken(token)
        updateSession({ pushToken: token })
      }
      if (!session.pushNotificationAllowed) {
        await alterPushNotificationsAllowance(true)
        updateSession({ pushNotificationAllowed: true })
      }
    } else {
      alert(
        'Apenas dispositivos físicos são suportados para notificações push.'
      )
    }

    if (Platform.OS === 'android') {
      setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }
  }

  const handlePushNotificationsResponse = async ({
    notification: {
      request: {
        content: {
          data: { notification, screenName, removedFromGroup },
        },
      },
    },
  }) => {
    onNotificationReceived(notification)
    removedFromGroup && onRemovedFromGroup({ groupId: removedFromGroup })
    navigate(screenName)
  }

  return {
    registerForPushNotificationsAsync,
    handlePushNotificationsResponse,
  }
}
