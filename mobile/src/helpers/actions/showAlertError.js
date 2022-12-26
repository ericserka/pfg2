import { Alert } from 'react-native'
import { handleHttpError } from '../errors'
import { log } from '../logger'

export const showAlertError = (error) => {
  log.error(`[${error.name}] ${error.message} - StackTrace: ${error.stack}`)
  Alert.alert('Erro', handleHttpError(error))
}
