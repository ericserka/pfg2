import io from 'socket.io-client'

let socket

export function emitEventInitSocket(cb) {
  console.log('Connecting socket...')

  socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling', 'flashsocket'],
  })

  socket.emit('init-connection', null, cb)
}

export function emitEventDisconnect() {
  console.log('Disconnecting socket...')
  if (socket) socket.disconnect()
}
