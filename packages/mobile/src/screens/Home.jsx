import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { CenterLoading } from '../components/loading/CenterLoading'
import { AsyncAlert } from '../components/utils/AsyncAlert'
import { shuffle } from '@pfg2/snippets'

export const Home = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>Home</Text>
      {/* it is possible to change the color and size of the icons easily */}
      <FontAwesome5 name="location-arrow" size={20} color="blue" />
      <Button title="SignIn" onPress={() => navigation.navigate('SignIn')} />
      <CenterLoading />
      <Button
        title="Async Alert"
        onPress={async () =>
          await AsyncAlert('titulo do alerta', 'corpo do alerta')
        }
      />
      <Text>{shuffle('eric serka do carmo rodrigues')}</Text>
    </View>
  )
}
