import { Center, Text, FlatList } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import dayjs from '@pfg2/dayjs'

export const Notifications = () => {
  // type INVITE HELP MESSAGE
  // status PENDING ACCEPTED REJECTED
  // users and notifications relationship many to many
  const notifications = [
    {
      type: 'INVITE',
      status: 'REJECTED',
      createdAt: dayjs().format(),
      content: 'User1 te convidou para fazer parte do grupo "familia 1"',
      seen: false,
    },
    {
      type: 'INVITE',
      status: 'ACCEPTED',
      createdAt: dayjs().format(),
      content: 'User1 te convidou para fazer parte do grupo "familia 1"',
      seen: false,
    },
    {
      type: 'INVITE',
      status: 'PENDING',
      createdAt: dayjs().format(),
      content: 'User1 te convidou para fazer parte do grupo "familia 1"',
      seen: true,
    },
    {
      type: 'HELP',
      createdAt: dayjs().format(),
      content:
        'User1 solicitou ajuda. Você está a x km de distância. Trace uma rota utilizando o google maps: https://google.maps/route',
      seen: true,
    },
    {
      type: 'MESSAGE',
      createdAt: dayjs().format(),
      content: 'Grupo 1 tem novas mensagens.',
      seen: true,
    },
  ]
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center>ss</Center>
    </SafeAreaView>
  )
}
