import { StackNavigator } from './src/components/routes/StackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import { useEffect } from 'react'
import {
  emitEventInitSocket,
  emitEventDisconnect,
} from './src/services/api/socket'

export default function App() {
  useEffect(() => {
    emitEventInitSocket((err) => {
      if (err) {
        console.error({ err })
        return
      }

      console.log('socket connection successfully initialized')
    })

    return () => {
      emitEventDisconnect()
    }
  }, [])

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
