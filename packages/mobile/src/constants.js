import { REACT_APP_JWT_KEY, REACT_APP_SERVER_URL } from '@env'
import { log } from '@pfg2/logger'
import { Dimensions } from 'react-native'

export const SERVER_URL = REACT_APP_SERVER_URL

log.debug('SERVER_URL', SERVER_URL)
log.debug('REACT_APP_SERVER_URL', REACT_APP_SERVER_URL)

export const JWT_KEY = REACT_APP_JWT_KEY

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
