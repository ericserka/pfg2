import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Column, Divider, FlatList, Flex, Text } from 'native-base'
import { useCallback, useEffect } from 'react'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LoadingInterceptor } from '../components/loading/LoadingInterceptor'
import { MessageBox } from '../components/MessageBox'
import { NotificationAction } from '../components/notifications/NotificationAction'
import dayjs from '../helpers/dayjs'
import { useNotifications } from '../store/notifications/provider'

export const Notifications = () => {
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
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <FlatList
          my="2"
          data={notifications}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={(props) => <Divider {...props} />}
          ListEmptyComponent={() => (
            <MessageBox
              type="info"
              content="Sem notificações por enquanto."
              mt="0.5"
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={queryLoading}
              onRefresh={getNotifications}
            />
          }
          renderItem={({ item }) => (
            <Column p="3" opacity={item.seen ? 40 : 100}>
              <Text bold maxW="75%" textAlign="justify">
                {item.content}
              </Text>
              <Flex direction="row" align="center" justify="space-between">
                <Text>
                  {dayjs(item.createdAt).format('DD[ de ]MMM[ às ]hh:mm')}
                </Text>
                <NotificationAction notification={item} />
              </Flex>
            </Column>
          )}
        />
      </SafeAreaView>
    </LoadingInterceptor>
  )
}
