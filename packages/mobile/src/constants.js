import { log } from '@pfg2/logger'
import { Dimensions } from 'react-native'
import Constants from 'expo-constants'

export const SERVER_URL = Constants.expoConfig.extra.apiUrl

log.debug('SERVER_URL', SERVER_URL)

export const JWT_KEY = Constants.expoConfig.extra.jwtKey

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
