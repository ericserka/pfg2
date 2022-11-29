import { log } from '@pfg2/logger'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { api } from '../../services/api/axios'
import {
  fetchJwtLocal,
  removeJwtLocal,
  storeJwtLocal,
} from '../../services/local-storage'
import { userAuthReducer } from './reducer'

const userAuthInitialState = {
  session: undefined,
  queryLoading: false,
  mutationLoading: false,
}

const UserAuthContext = createContext({
  state: { ...userAuthInitialState },
})

export const useUserAuth = () => useContext(UserAuthContext)

export const UserAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userAuthReducer, userAuthInitialState)

  const getUserFromLocalStorage = async () => {
    const token = await fetchJwtLocal()
    if (!token) return

    log.debug(token)
    const authHeader = { Authorization: `Bearer ${token}` }

    toggleQueryLoading(dispatch)
    try {
      const { data } = await api.get('/users/me', {
        headers: authHeader,
      })
      dispatch({ type: 'SIGNIN', payload: data })
      api.defaults.headers = {
        ...api.defaults.headers,
        ...authHeader,
      }
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleQueryLoading(dispatch)
    }
  }

  useEffect(() => {
    getUserFromLocalStorage()
  }, [])

  const signin = async (formData) => {
    toggleMutationLoading(dispatch)
    try {
      const { data } = await api.post('/auth/login', formData)
      storeJwtLocal(data.token)
      api.defaults.headers = {
        Authorization: `Bearer ${data.token}`,
      }
      dispatch({
        type: 'SIGNIN',
        payload: data,
      })
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const signup = async (data, onSuccess) => {
    toggleMutationLoading(dispatch)
    try {
      await api.post('/auth/register', data)
      onSuccess()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const logout = async () => {
    removeJwtLocal()

    dispatch({
      type: 'LOGOUT',
    })
  }

  return (
    <UserAuthContext.Provider
      value={{
        state,
        actions: {
          signin,
          signup,
          logout,
        },
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}
