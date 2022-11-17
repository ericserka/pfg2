import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignIn } from '../../screens/auth/SignIn'
import { SignUp } from '../../screens/auth/SignUp'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'

const Stack = createNativeStackNavigator()

export const AuthStack = () => (
  <LoadingInterceptor>
    <Stack.Navigator>
      <Stack.Screen name="Entrar" component={SignIn} />
      <Stack.Screen name="Cadastrar" component={SignUp} />
    </Stack.Navigator>
  </LoadingInterceptor>
)
