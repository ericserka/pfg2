import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GroupDetail } from '../../screens/GroupDetail'
import { GroupsList } from '../../screens/GroupsList'

const Stack = createNativeStackNavigator()

export const GroupsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      header: () => null,
    }}
  >
    <Stack.Screen name="ListaGrupos" component={GroupsList} />
    <Stack.Screen name="DetalhesGrupo" component={GroupDetail} />
  </Stack.Navigator>
)
