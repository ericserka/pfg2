import { createContext, useContext, useReducer } from 'react'
import { usersReducer } from './reducer'

const usersInitialState = {
  users: [],
}

const UsersContext = createContext({
  state: { ...usersInitialState },
})

export const useUsers = () => useContext(UsersContext)

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, usersInitialState)

  const setUsers = (data) => {
    if (data) {
      dispatch({
        type: 'SET_USERS',
        payload: data,
      })
    }
  }

  return (
    <UsersContext.Provider value={{ state, usersActions: { setUsers } }}>
      {children}
    </UsersContext.Provider>
  )
}
