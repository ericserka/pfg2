import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chat } from '../../screens/Chat'
import { Home } from '../../screens/Home'

const Stack = createNativeStackNavigator()

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      header: () => null,
    }}
  >
    <Stack.Screen name="Mapa" component={Home} />
    <Stack.Screen name="Chat" component={Chat} />
  </Stack.Navigator>
)
