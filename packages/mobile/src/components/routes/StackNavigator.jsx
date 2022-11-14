import { useUserAuth } from '../../store/auth/provider'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'
import { AuthStack } from './AuthStack'
import { LoggedTabs } from './LoggedTabs'

export const StackNavigator = () => {
  const {
    authState: { session, loading },
  } = useUserAuth()

  return (
    <LoadingInterceptor loading={loading}>
      {session ? <LoggedTabs /> : <AuthStack />}
    </LoadingInterceptor>
  )
}
