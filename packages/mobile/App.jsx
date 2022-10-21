import { StackNavigator } from './src/components/routes/StackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import { useEffect } from 'react'
import {
  emitEventInitSocket,
  emitEventDisconnect,
  listenToHelloFromServerEvent,
} from './src/services/api/socket'
import HelloProvider from './src/store/hello/provider'
import { Alert } from 'react-native'

export default function App() {
  useEffect(() => {
    emitEventInitSocket((err) => {
      if (err) {
        console.error({ err })
        return
      }

      listenToHelloFromServerEvent((message) => {
        Alert.alert('my title', message.message)
      })
    })

    return () => {
      emitEventDisconnect()
    }
  }, [])

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <HelloProvider>
          <StackNavigator />
        </HelloProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
