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
import { emergencyReducer } from './reducer'

const emergencyInitialState = {
  mutationLoading: false,
}

const EmergencyContext = createContext({
  state: { ...emergencyInitialState },
})

export const useEmergency = () => useContext(EmergencyContext)

export const EmergencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emergencyReducer, emergencyInitialState)

  const askHelp = async (data, onSuccess) => {
    toggleMutationLoading(dispatch)
    try {
      console.log('solicitando ajuda...', data)
      onSuccess()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  return (
    <EmergencyContext.Provider
      value={{
        state,
        actions: {
          askHelp,
        },
      }}
    >
      {children}
    </EmergencyContext.Provider>
  )
}
