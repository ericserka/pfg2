import { Dimensions } from 'react-native'
import Constants from 'expo-constants'

export const SERVER_URL = Constants.expoConfig.extra.apiUrl

export const JWT_KEY = Constants.expoConfig.extra.jwtKey

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export const COLOR_PRIMARY_600 = '#0891B2'
export const COLOR_SUCCESS_600 = '#16A34A'
export const COLOR_ERROR_600 = '#DC2626'