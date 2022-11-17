import { Alert } from 'react-native'
import { handleError } from '../errors'

export const showAlertError = (error) => {
  Alert.alert('Erro', handleError(error))
}
