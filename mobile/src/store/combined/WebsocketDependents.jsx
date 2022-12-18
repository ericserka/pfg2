import { LoadingInterceptor } from '../../components/loading/LoadingInterceptor'
import { UserGroupProvider } from '../groups/provider'
import { UserLocationProvider } from '../location/provider'
import { NotificationsProvider } from '../notifications/provider'
import { UsersProvider } from '../user/provider'
import { useWebSocket } from '../websocket/provider'

export const WebsocketDependents = ({ children }) => {
  const { socket } = useWebSocket()

  return (
    <LoadingInterceptor loading={!socket}>
      <UserLocationProvider>
        <UserGroupProvider>
          <NotificationsProvider>
            <UsersProvider>{children}</UsersProvider>
          </NotificationsProvider>
        </UserGroupProvider>
      </UserLocationProvider>
    </LoadingInterceptor>
  )
}
