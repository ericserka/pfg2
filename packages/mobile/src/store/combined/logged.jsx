import { EmergencyProvider } from '../emergency/provider'
import { UserGroupProvider } from '../groups/provider'
import { UserLocationProvider } from '../location/provider'
import { WebSocketProvider } from '../websocket/provider'

// colocar providers que só existem no contexto quando o usuário está logado (autenticado) um em cima do outro até chegar no children

export const LoggedProviders = ({ children }) => {
  return (
    <WebSocketProvider>
      <UserLocationProvider>
        <UserGroupProvider>
          <EmergencyProvider>{children}</EmergencyProvider>
        </UserGroupProvider>
      </UserLocationProvider>
    </WebSocketProvider>
  )
}
