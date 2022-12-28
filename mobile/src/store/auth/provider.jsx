import { createContext, useContext, useEffect, useReducer } from 'react'
import { Alert } from 'react-native'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { log } from '../../helpers/logger'
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
    Alert.alert(
      'Tem certeza?',
      'Deslogar impossibilitará você de receber notificações dos seus entes queridos.',
      [
        {
          text: 'Continuar',
          onPress: async () => {
            try {
              toggleQueryLoading(dispatch)
              if (state?.session?.pushToken) {
                await api.patch('/users', {
                  pushToken: null,
                })
              }
              removeJwtLocal()
              dispatch({
                type: 'LOGOUT',
              })
            } catch (err) {
              showAlertError(err)
            } finally {
              toggleQueryLoading(dispatch)
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    )
  }

  const updateSession = (session) => {
    dispatch({
      type: 'UPDATE_SESSION',
      payload: session,
    })
  }

  const saveRandomUserPassword = async (data, onSuccess) => {
    try {
      await api.patch('/auth/random-password', data)
      onSuccess()
    } catch (err) {
      showAlertError(err)
    }
  }

  return (
    <UserAuthContext.Provider
      value={{
        state,
        actions: {
          signin,
          signup,
          logout,
          updateSession,
          saveRandomUserPassword,
        },
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}
