import { onInit } from './functions.js'

export const ChatSocketHandler = (socket) => {
  socket.on('init-connection', (args, cb) => onInit(socket, args, cb))
}
