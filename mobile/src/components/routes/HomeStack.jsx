import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chat } from '../../screens/Chat'
import { Config } from '../../screens/Config'
import { GroupConfig } from '../../screens/GroupConfig'
import { Home } from '../../screens/Home'
import { InviteUsersForm } from '../InviteUsersForm'

const Stack = createNativeStackNavigator()

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      header: () => null,
    }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Chat" component={Chat} />
    <Stack.Screen name="Configurações" component={Config} />
    <Stack.Screen name="Criar Grupo">
      {(props) => <InviteUsersForm {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Adicionar Membros">
      {(props) => <InviteUsersForm {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Configurações Grupo" component={GroupConfig} />
  </Stack.Navigator>
)
