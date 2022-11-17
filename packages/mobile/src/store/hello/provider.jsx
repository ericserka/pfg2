import { createContext, useContext, useReducer } from 'react'
import { helloReducer } from './reducer'

const helloInitialState = {
  messages: [],
}

const HelloContext = createContext({
  state: { ...helloInitialState },
})

export const useHello = () => useContext(HelloContext)

export const HelloProvider = ({ children }) => {
  const [state, dispatch] = useReducer(helloReducer, helloInitialState)

  const newMessage = (data) => {
    if (data) {
      dispatch({
        type: 'NEW_MESSAGE',
        payload: data,
      })
    }
  }

  return (
    <HelloContext.Provider value={{ state, helloActions: { newMessage } }}>
      {children}
    </HelloContext.Provider>
  )
}
