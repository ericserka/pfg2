import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  Center,
  Column,
  Divider,
  FlatList,
  Flex,
  Spinner,
  Text,
} from 'native-base'
import { useCallback, useEffect, useRef } from 'react'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LoadingInterceptor } from '../components/loading/LoadingInterceptor'
import { MessageBox } from '../components/MessageBox'
import { NotificationAction } from '../components/notifications/NotificationAction'
import { scrollToTop } from '../helpers/actions/scrollToTop'
import { dayjs } from '../helpers/dayjs'
import { useNotifications } from '../store/notifications/provider'

export const Notifications = () => {
  const {
    actions: { getNotifications, markUnreadNotificationsAsRead },
    state: { notifications, queryLoading, paginationLoading },
  } = useNotifications()
  const navigation = useNavigation()

  const flatListRef = useRef(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'blur',
      markUnreadNotificationsAsRead
    )

    return () => {
      unsubscribe()
    }
  }, [navigation, markUnreadNotificationsAsRead])

  useFocusEffect(
    useCallback(() => {
      scrollToTop(flatListRef)
    }, [])
  )

  return (
    <LoadingInterceptor loading={queryLoading}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <FlatList
          ref={flatListRef}
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
              onRefresh={() => getNotifications(1)}
            />
          }
          renderItem={({ item }) => (
            <Column p="3" opacity={item.seen ? 40 : 100}>
              <Text bold maxW="75%" textAlign="justify">
                {item.content}
              </Text>
              <Flex direction="row" align="center" justify="space-between">
                <Text>{dayjs(item.createdAt).format('lll')}</Text>
                <NotificationAction notification={item} />
              </Flex>
            </Column>
          )}
          onEndReached={() => getNotifications()}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            paginationLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : null
          }
        />
      </SafeAreaView>
    </LoadingInterceptor>
  )
}
