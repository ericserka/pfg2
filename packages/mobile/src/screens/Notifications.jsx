import dayjs from '@pfg2/dayjs'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  Box,
  Center,
  Column,
  FlatList,
  Row,
  Text,
  HStack,
  VStack,
  Flex,
  Divider,
} from 'native-base'
import { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LoadingInterceptor } from '../components/loading/LoadingInterceptor'
import { MessageBox } from '../components/MessageBox'
import { NotificationAction } from '../components/notifications/NotificationAction'
import { useNotifications } from '../store/notifications/provider'
import { RefreshControl } from 'react-native'

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
            <VStack p="3" opacity={item.seen ? 40 : 100}>
              <Text bold maxW="75%" textAlign="justify">
                {item.content}
              </Text>
              <Flex direction="row" align="center" justify="space-between">
                <Text>
                  {dayjs(item.createdAt).format('DD[ de ]MMM[ às ]hh:mm')}
                </Text>
                <NotificationAction notification={item} />
              </Flex>
            </VStack>
            // <Box borderBottomWidth="1" p="3" opacity={item.seen ? 40 : 100}>
            //   <Row space={3} justifyContent="space-between">
            //     <Column space={1} w="70%">
            //       <Text bold>{item.content}</Text>
            //       <Text>{dayjs(item.createdAt).format('lll')}</Text>
            //     </Column>
            //     <NotificationAction notification={item} />
            //   </Row>
            // </Box>
          )}
        />
      </SafeAreaView>
    </LoadingInterceptor>
  )
}
