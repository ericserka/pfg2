import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chat } from '../../screens/Chat'
import { Home } from '../../screens/Home'
import { Config } from '../../screens/Config'
import { CreateGroup } from '../../screens/CreateGroup'

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
    <Stack.Screen name="Configurações" component={Config} />
    <Stack.Screen name="Criar Grupo" component={CreateGroup} />
  </Stack.Navigator>
)
