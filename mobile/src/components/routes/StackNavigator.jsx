import { useUserAuth } from '../../store/auth/provider'
import { AuthStack } from './AuthStack'
import { LoggedTabs } from './LoggedTabs'

export const StackNavigator = () => {
  const {
    state: { session },
  } = useUserAuth()

  return session?.id ? <LoggedTabs /> : <AuthStack />
}
