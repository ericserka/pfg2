import { EmergencyProvider } from '../emergency/provider'
import { UserLocationProvider } from '../location/provider'

// colocar providers que só existem no contexto quando o usuário está logado (autenticado) um em cima do outro até chegar no children

export const LoggedProviders = ({ children }) => {
  return (
    <EmergencyProvider>
      <UserLocationProvider>{children}</UserLocationProvider>
    </EmergencyProvider>
  )
}
