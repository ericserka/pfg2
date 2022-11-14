import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_KEY } from '../../constants'

export const storeUserLocal = async (user) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const fetchUserLocal = async () =>
  JSON.parse(await AsyncStorage.getItem(USER_KEY))

export const removeUserLocal = async () => {
  await AsyncStorage.removeItem(USER_KEY)
}
