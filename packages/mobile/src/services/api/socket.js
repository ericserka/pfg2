import io from 'socket.io-client'
import { BASE_URL } from '../../constants'

let socket

export const emitEventInitSocket = (userId, cb) => {
  console.log('Connecting socket...')

  socket = io(BASE_URL, {
    transports: ['websocket', 'polling', 'flashsocket'],
  })

  socket.emit('init-connection', { userId }, cb)
}

export const emitEventDisconnect = () => {
  console.log('Disconnecting socket...')
  if (socket) socket.disconnect()
}

export const emitEventSendMessage = (cb) => {
  if (!socket) return

  socket.emit('send-message', null, cb)
}

export const listenToHelloFromServerEvent = (cb) => {
  if (!socket) return

  socket.on('message-added', cb)
}
