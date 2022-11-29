import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  hasServicesEnabledAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { AppState, Platform } from 'react-native'
import { Emergency } from '../../screens/Emergency'
import { Notifications } from '../../screens/Notifications'
import { LoggedProviders } from '../../store/combined/logged'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'
import { Left } from '../navbar/Left'
import { Right } from '../navbar/Right'
import { NoLocationPermissions } from '../NoLocationPermissions'
import { HomeStack } from './HomeStack'

const Tab = createBottomTabNavigator()

export const LoggedTabs = () => {
  const [perms, setPerms] = useState(false)
  const [loading, setLoading] = useState(true)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          await checkPermissions()
        }
        appState.current = nextAppState
      }
    )

    checkPermissions()

    return () => {
      subscription.remove()
    }
  }, [])

  const checkPermissions = async () => {
    const { granted } = await (Platform.OS === 'ios'
      ? requestForegroundPermissionsAsync()
      : requestBackgroundPermissionsAsync())
    const enabled = await hasServicesEnabledAsync()

    setPerms(granted && enabled)
    setLoading(false)
  }

  if (!perms) return <NoLocationPermissions />

  return (
    <LoggedProviders>
      <LoadingInterceptor extra={[loading]}>
        <Tab.Navigator
          screenOptions={{
            headerLeft: (props) => <Left {...props} />,
            headerRight: (props) => <Right {...props} />,
            headerShadowVisible: true,
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              headerTransparent: true,
              tabBarIcon: (props) => <FontAwesome5 name="map" {...props} />,
            }}
            component={HomeStack}
          />
          <Tab.Screen
            name="Emergência"
            options={{
              tabBarIcon: (props) => (
                <FontAwesome5 name="exclamation-circle" {...props} />
              ),
            }}
            component={Emergency}
          />
          <Tab.Screen
            name="Notificações"
            options={{
              tabBarIcon: (props) => <FontAwesome5 name="bell" {...props} />,
              tabBarBadge: 3,
            }}
            component={Notifications}
          />
        </Tab.Navigator>
      </LoadingInterceptor>
    </LoggedProviders>
  )
}
