import { UserGroupProvider } from '../groups/provider'
import { UserLocationProvider } from '../location/provider'
import { NotificationsProvider } from '../notifications/provider'
import { UsersProvider } from '../user/provider'
import { WebSocketProvider } from '../websocket/provider'

// colocar providers que só existem no contexto quando o usuário está logado (autenticado) um em cima do outro até chegar no children

export const LoggedProviders = ({ children }) => {
  return (
    <WebSocketProvider>
      <UserLocationProvider>
        <UserGroupProvider>
          <NotificationsProvider>
            <UsersProvider>{children}</UsersProvider>
          </NotificationsProvider>
        </UserGroupProvider>
      </UserLocationProvider>
    </WebSocketProvider>
  )
}
