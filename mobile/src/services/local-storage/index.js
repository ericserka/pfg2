import AsyncStorage from '@react-native-async-storage/async-storage'
import { JWT_KEY } from '../../constants'
import { log } from '../../helpers/logger'

export const storeJwtLocal = async (jwt) => {
  if (!jwt) return
  log.debug('[LOCAL_STORAGE] saving JWT', jwt)
  await AsyncStorage.setItem(JWT_KEY, `${jwt}`)
}

export const fetchJwtLocal = async () => {
  log.debug('[LOCAL_STORAGE] fetch JWT')
  return await AsyncStorage.getItem(JWT_KEY)
}

export const removeJwtLocal = async () => {
  log.debug('[LOCAL_STORAGE] delete JWT')
  await AsyncStorage.removeItem(JWT_KEY)
}
