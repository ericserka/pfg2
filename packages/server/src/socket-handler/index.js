import { onInit, onSendMessage } from './functions.js'

export const SocketHandler = (socket) => {
  socket.on('init-connection', (args, cb) => onInit(socket, args, cb))
  socket.on('send-message', (args, cb) => onSendMessage(socket, args, cb))
}
