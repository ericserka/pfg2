import { WebSocketProvider } from '../websocket/provider'
import { WebsocketDependents } from './WebsocketDependents'

// colocar providers que só existem no contexto quando o usuário está logado (autenticado) um em cima do outro até chegar no children

export const LoggedProviders = ({ children }) => (
  <WebSocketProvider>
    <WebsocketDependents>{children}</WebsocketDependents>
  </WebSocketProvider>
)
