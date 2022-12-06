import { Accuracy, getCurrentPositionAsync } from 'expo-location'
import { createContext, useContext, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { api } from '../../services/api/axios'
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

  const askHelp = async (content, onSuccess) => {
    toggleMutationLoading(dispatch)
    try {
      const {
        coords: { latitude, longitude },
      } = await getCurrentPositionAsync({
        accuracy: Accuracy.Highest,
      })
      await api.post('/notifications/ask-help', {
        content,
        latitude,
        longitude,
      })
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
