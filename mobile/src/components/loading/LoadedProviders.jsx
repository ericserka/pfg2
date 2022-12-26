import { useUserAuth } from '../../store/auth/provider'
import { useUserGroup } from '../../store/groups/provider'
import { useWebSocket } from '../../store/websocket/provider'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'

export const LoadedProviders = ({ children }) => {
  const {
    state: { queryLoading: authLoading },
  } = useUserAuth()
  const {
    state: { queryLoading: groupsLoading },
  } = useUserGroup()
  const { socket } = useWebSocket()

  return (
    <LoadingInterceptor loading={!socket || authLoading || groupsLoading}>
      {children}
    </LoadingInterceptor>
  )
}
