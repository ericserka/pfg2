import axios from 'axios'

export const api = axios.create({
  // ngrok url for http:localhost:3000
  baseURL: 'https://c391-179-48-44-246.sa.ngrok.io',
})
