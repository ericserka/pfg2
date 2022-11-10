import io from 'socket.io-client'

let socket

export const emitEventInitSocket = (cb) => {
  console.log('Connecting socket...')

  // ngrok url for http:localhost:3000
  socket = io('https://c391-179-48-44-246.sa.ngrok.io', {
    transports: ['websocket', 'polling', 'flashsocket'],
  })

  socket.emit('init-connection', null, cb)
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
