import {
  hasServicesEnabledAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { AppState, Platform } from 'react-native'
import { LoggedProviders } from '../../store/combined/logged'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'
import { NoLocationPermissions } from '../NoLocationPermissions'
import { BottomTabs } from './BottomTabs'

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
      <LoadingInterceptor loading={loading}>
        <BottomTabs />
      </LoadingInterceptor>
    </LoggedProviders>
  )
}
