import { UserLocationProvider } from '../location/provider'
import { UsersProvider } from '../users/provider'

// colocar providers que só existem no contexto quando o usuário está logado (autenticado) um em cima do outro até chegar no children

export const LoggedProviders = ({ children }) => {
  return (
    <UsersProvider>
      <UserLocationProvider>{children}</UserLocationProvider>
    </UsersProvider>
  )
}
