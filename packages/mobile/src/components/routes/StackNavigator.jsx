import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { SignIn } from '../../screens/auth/SignIn'
import { Home } from '../../screens/Home'
import {
  emitEventDisconnect,
  emitEventInitSocket,
  listenToHelloFromServerEvent,
} from '../../services/api/socket'
import { useHello } from '../../store/hello/provider'

const Stack = createNativeStackNavigator()

export const StackNavigator = () => {
  const { helloActions } = useHello()

  useEffect(() => {
    emitEventInitSocket((err) => {
      if (err) {
        console.error({ err })
      }

      listenToHelloFromServerEvent(helloActions.newMessage)
    })

    return () => {
      emitEventDisconnect()
    }
  }, [])

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
