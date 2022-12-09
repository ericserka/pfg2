import { createContext, useContext, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { api } from '../../services/api/axios'
import { usersReducer } from './reducer'

const usersInitialState = {}

const UsersContext = createContext({
  state: { ...usersInitialState },
})

export const useUsers = () => useContext(UsersContext)

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, usersInitialState)

  const alterPushToken = async (pushToken) => {
    try {
      await api.patch('/users/push-token', {
        pushToken,
      })
    } catch (err) {
      showAlertError(err)
    }
  }

  const alterPushNotificationsAllowance = async (pushNotificationAllowed) => {
    try {
      await api.patch('/users/push-notifications-allowance', {
        pushNotificationAllowed,
      })
    } catch (err) {
      showAlertError(err)
    }
  }

  return (
    <UsersContext.Provider
      value={{
        state,
        actions: {
          alterPushToken,
          alterPushNotificationsAllowance,
        },
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
