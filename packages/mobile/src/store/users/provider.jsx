import { createContext, useContext, useReducer } from 'react'
import { usersReducer } from './reducer'

const usersInitialState = {
  users: [],
}

const UsersContext = createContext({
  usersState: { ...usersInitialState },
})

export const useUsers = () => useContext(UsersContext)

export default function UsersProvider({ children }) {
  const [usersState, dispatch] = useReducer(usersReducer, usersInitialState)

  const setUsers = (data) => {
    if (data) {
      dispatch({
        type: 'SET_USERS',
        payload: data,
      })
    }
  }

  return (
    <UsersContext.Provider value={{ usersState, usersActions: { setUsers } }}>
      {children}
    </UsersContext.Provider>
  )
}
