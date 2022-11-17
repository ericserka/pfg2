import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { api } from '../../services/api/axios'
import {
  fetchJwtLocal,
  removeJwtLocal,
  storeJwtLocal,
} from '../../services/local-storage'
import { userAuthReducer } from './reducer'
import { log } from '@pfg2/logger'

export const userAuthInitialState = {
  session: undefined,
  error: undefined,
  loading: false,
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

    toggleQueryLoading(dispatch)
    try {
      log.debug('getUserFromLocalStorage try')

      const { data } = await api.get('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({ type: 'SIGNIN', payload: data })
    } catch (err) {
      log.debug('getUserFromLocalStorage catch')

      showAlertError(err)
    } finally {
      log.debug('getUserFromLocalStorage finally')

      toggleQueryLoading(dispatch)
    }
  }

  useEffect(() => {
    getUserFromLocalStorage()
  }, [])

  const signin = async ({ email, password }) => {
    toggleMutationLoading(dispatch)
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      })
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

  const signup = async ({ email, name }, onSuccess) => {
    toggleMutationLoading(dispatch)
    try {
      await api.post('/auth/register', {
        email,
        name,
      })
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
        authActions: {
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
