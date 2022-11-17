import AsyncStorage from '@react-native-async-storage/async-storage'
import { JWT_KEY } from '../../constants'

export const storeJwtLocal = async (jwt) => {
  await AsyncStorage.setItem(JWT_KEY, jwt)
}

export const fetchJwtLocal = async () => await AsyncStorage.getItem(JWT_KEY)

export const removeJwtLocal = async () => {
  await AsyncStorage.removeItem(JWT_KEY)
}
