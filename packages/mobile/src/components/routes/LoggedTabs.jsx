import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  requestForegroundPermissionsAsync,
  hasServicesEnabledAsync,
} from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { Home } from '../../screens/Home'
import { LoggedProviders } from '../../store/combined/logged'
import { HelloProvider } from '../../store/hello/provider'
import { Left } from '../navbar/Left'
import { Right } from '../navbar/Right'
import { NoLocationPermissions } from '../NoLocationPermissions'
import { GroupsStack } from './GroupsStack'

const Tab = createBottomTabNavigator()

export const LoggedTabs = () => {
  const [perms, setPerms] = useState(false)
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
    const { granted } = await requestForegroundPermissionsAsync()
    const enabled = await hasServicesEnabledAsync()

    setPerms(granted && enabled)
  }

  return perms ? (
    <HelloProvider>
      <LoggedProviders>
        <Tab.Navigator
          screenOptions={{
            headerLeft: (props) => <Left {...props} />,
            headerRight: (props) => <Right {...props} />,
            headerShadowVisible: true,
          }}
        >
          <Tab.Screen
            name="Mapa"
            options={{
              headerTransparent: true,
              tabBarIcon: (props) => (
                <FontAwesome5 name="map-marked" {...props} />
              ),
            }}
            component={Home}
          />
          <Tab.Screen
            name="Grupo"
            options={{
              tabBarIcon: (props) => <FontAwesome5 name="users" {...props} />,
            }}
            component={GroupsStack}
          />
        </Tab.Navigator>
      </LoggedProviders>
    </HelloProvider>
  ) : (
    <NoLocationPermissions />
  )
}
