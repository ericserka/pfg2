import { Dimensions } from 'react-native'

export const BASE_URL = 'https://fefd-179-48-44-246.sa.ngrok.io'

export const USER_KEY = '@pfg2:unb:user'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
