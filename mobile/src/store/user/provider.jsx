import { createContext, useContext, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { usersReducer } from './reducer'

const usersInitialState = {
  mutationLoading: false,
}

const UsersContext = createContext({
  state: { ...usersInitialState },
})

export const useUsers = () => useContext(UsersContext)

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, usersInitialState)
  const {
    actions: { updateSession },
  } = useUserAuth()

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

  const updateUser = async (data, onSuccess) => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/users', data)
      updateSession(data)
      onSuccess()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const updateUserPassword = async (data, onSuccess) => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/users/password', data)
      onSuccess()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  return (
    <UsersContext.Provider
      value={{
        state,
        actions: {
          alterPushToken,
          alterPushNotificationsAllowance,
          updateUser,
          updateUserPassword,
        },
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
