import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider, View } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StackNavigator } from './src/components/routes/StackNavigator'
import { UserAuthProvider } from './src/store/auth/provider'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const queryClient = new QueryClient()
  const [appIsReady, setAppIsReady] = useState(false)
  const prepare = async () => {
    try {
      await Promise.all([
        Font.loadAsync(FontAwesome.font),
        Font.loadAsync(FontAwesome5.font),
      ])
    } catch (error) {
      console.warn({ error })
    } finally {
      setAppIsReady(true)
    }
  }

  useEffect(() => {
    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  return appIsReady ? (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <View onLayout={onLayoutRootView} flex={1}>
            <NavigationContainer>
              <StatusBar translucent animated style="auto" />
              <UserAuthProvider>
                <StackNavigator />
              </UserAuthProvider>
            </NavigationContainer>
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  ) : null
}
