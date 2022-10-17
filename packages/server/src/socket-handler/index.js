import { onInit } from './functions.js'

export const SocketHandler = (socket) => {
  socket.on('init-connection', (args, cb) => onInit(socket, args, cb))
}
