import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home } from '../../screens/Home'
import { SignIn } from '../../screens/auth/SignIn'

const Stack = createNativeStackNavigator()

export const StackNavigator = () => {
  const user = true
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SignIn" component={SignIn} />
        </>
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} />
      )}
    </Stack.Navigator>
  )
}
