import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NativeBaseProvider } from 'native-base'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StackNavigator } from './src/components/routes/StackNavigator'

import { StatusBar } from 'expo-status-bar'
import { HelloProvider } from './src/store/hello/provider'
import { UsersProvider } from './src/store/users/provider'

export default function App() {
  const queryClient = new QueryClient()

  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar translucent animated style="auto" />
            <UsersProvider>
              <HelloProvider>
                <StackNavigator />
              </HelloProvider>
            </UsersProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  )
}
