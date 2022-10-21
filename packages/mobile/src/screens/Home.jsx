import { View, Text, Button, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { CenterLoading } from '../components/loading/CenterLoading'
import { AsyncAlert } from '../components/utils/AsyncAlert'
import { shuffle } from '@pfg2/snippets'
import dayjs from 'dayjs'
import { useHello } from '../store/hello/provider'
import { emitEventSendMessage } from '../services/api/socket'

export const Home = () => {
  const navigation = useNavigation()
  const { state, actions } = useHello()
  return (
    <View>
      <Text>Home</Text>
      {/* it is possible to change the color and size of the icons easily */}
      <FontAwesome5 name="location-arrow" size={20} color="blue" />
      <Button title="SignIn" onPress={() => navigation.navigate('SignIn')} />
      <CenterLoading />
      <Button
        title="Async Alert"
        onPress={async () => await AsyncAlert('alert title', 'alert body')}
      />
      <Text>{shuffle('eric serka do carmo rodrigues')}</Text>
      <Text>{dayjs().format()}</Text>
      <Button
        title="Add new message"
        onPress={() =>
          emitEventSendMessage((message) => {
            actions.newMessage(message)
          })
        }
      />
      <FlatList
        data={state.messages}
        renderItem={({ item }) => (
          <>
            <Text>{item.datetime}</Text>
            <Text>{item.content}</Text>
          </>
        )}
      />
    </View>
  )
}
