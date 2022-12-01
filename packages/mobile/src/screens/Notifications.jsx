import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Box, Center, Column, FlatList, Row, Text } from 'native-base'
import { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LoadingInterceptor } from '../components/loading/LoadingInterceptor'
import { NotificationAction } from '../components/notifications/NotificationAction'
import { useNotifications } from '../store/notifications/provider'

export const Notifications = () => {
  // type INVITE HELP MESSAGE
  // status PENDING ACCEPTED REJECTED
  // users and notifications relationship one to many
  const {
    actions: { getNotifications, markUnreadNotificationsAsRead },
    state: { notifications, queryLoading },
  } = useNotifications()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      markUnreadNotificationsAsRead()
    })

    return unsubscribe
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      getNotifications()
    }, [])
  )

  return (
    <LoadingInterceptor loading={queryLoading}>
      <SafeAreaView style={{ flex: 1 }}>
        <Center>
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <Box borderBottomWidth="1" p="3" opacity={item.seen ? 40 : 100}>
                <Row space={3} justifyContent="space-between">
                  <Column space={1} w="70%">
                    <Text>{item.content}</Text>
                    <Text bold>{item.createdAt}</Text>
                  </Column>
                  <NotificationAction
                    type={item.type}
                    status={item.status}
                    sender={item.sender}
                  />
                </Row>
              </Box>
            )}
          />
        </Center>
      </SafeAreaView>
    </LoadingInterceptor>
  )
}
