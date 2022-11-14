import { useNavigation } from '@react-navigation/native'
import { HttpStatusCode } from 'axios'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { api } from '../../services/api/axios'
import { removeUserLocal, storeUserLocal } from '../../services/local-storage'
import { userAuthReducer } from './reducer'

export const userAuthInitialState = {
  session: undefined,
  error: undefined,
}

const UserAuthContext = createContext({
  authState: { ...userAuthInitialState },
})

export const useUserAuth = () => useContext(UserAuthContext)

export const UserAuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(
    userAuthReducer,
    userAuthInitialState
  )
  const { navigate } = useNavigation()

  useEffect(() => {
    // dispatch SIGNIN or SIGNOUT
    dispatch({
      type: 'SIGNIN',
      payload: {
        id: '213sfggcxzas35',
        email: 'eric@email.com',
        name: 'Eric Serka',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png',
      },
    })
  }, [])

  const signin = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', {
      email,
      password,
    })

    storeUserLocal(data.user)

    dispatch({
      type: 'SIGNIN',
      payload: data.user,
    })
  }

  const signup = async ({ email, password, username }) => {
    const { status } = await api.post('/auth/register', {
      email,
      password,
      username,
    })

    return status === HttpStatusCode.Created
  }

  const logout = async () => {
    removeUserLocal()

    dispatch({
      type: 'LOGOUT',
    })

    navigate('Entrar', {
      replace: true,
    })
  }

  return (
    <UserAuthContext.Provider
      value={{
        authState,
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
