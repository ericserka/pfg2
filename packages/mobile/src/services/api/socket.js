import io from 'socket.io-client'

let socket

export const emitEventInitSocket = (cb) => {
  console.log('Connecting socket...')

  socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling', 'flashsocket'],
  })

  socket.emit('init-connection', null, cb)
}

export const emitEventDisconnect = () => {
  console.log('Disconnecting socket...')
  if (socket) socket.disconnect()
}
