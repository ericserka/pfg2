import { Dimensions } from 'react-native'
import { REACT_APP_SERVER_URL } from '@env'

export const SERVER_URL = REACT_APP_SERVER_URL

export const USER_KEY = '@pfg2:unb:user'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
