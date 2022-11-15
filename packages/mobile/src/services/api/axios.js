import axios from 'axios'
import { SERVER_URL } from '../../constants'

export const api = axios.create({
  baseURL: SERVER_URL,
})
