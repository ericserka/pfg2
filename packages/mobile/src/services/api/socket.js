import io from 'socket.io-client'
import { BASE_URL } from '../../constants'
import { log } from '@pfg2/logger'

let socket

export const emitEventInitSocket = (userId, cb) => {
  log.info('Connecting socket...')

  socket = io(BASE_URL, {
    transports: ['websocket', 'polling', 'flashsocket'],
  })

  socket.emit('init-connection', { userId }, cb)
}

export const emitEventDisconnect = () => {
  log.info('Disconnecting socket...')
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
