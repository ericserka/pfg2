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

  const updateUser = async (data, onSuccess) => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/users', data)
      updateSession(data)
      onSuccess && onSuccess()
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

  const findUserByUsername = async (username) => {
    try {
      toggleMutationLoading(dispatch)
      return (await api.get(`/users/username/${username}`)).data
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
          updateUser,
          updateUserPassword,
          findUserByUsername,
        },
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
