import { useUserAuth } from '../../store/auth/provider'
import { AuthStack } from './AuthStack'
import { LoggedTabs } from './LoggedTabs'

export const StackNavigator = () => {
  const {
    authState: { session },
  } = useUserAuth()

  return session ? <LoggedTabs /> : <AuthStack />
}
