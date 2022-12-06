import { Alert } from 'react-native'
import { handleHttpError } from '../errors'
import { log } from '../logger'

export const showAlertError = (error) => {
  log.error(error)
  Alert.alert('Erro', handleHttpError(error))
}
