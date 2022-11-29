import {
  onJoinChat,
  onLeaveChat,
  onNewGroup,
  onSendMessage,
} from './messaging.js'
import { log } from '@pfg2/logger'
import { onLocationChange } from './location.js'

export const SocketHandler = (socket, io) => {
  socket.on('init-connection', (_, cb) => {
    log.info(`init socket: ${socket.id}`)
    cb(socket.connected ? null : { message: 'could not connect' })
  })

  socket.on('disconnect', () => {
    log.info(`disconnect socket: ${socket.id}`)
  })

  socket.on('join-group', (args, cb) => onJoinChat(socket, args, cb))

  socket.on('leave-group', (args, cb) => onLeaveChat(socket, args, cb))

  socket.on('send-message', (args, cb) =>
    onSendMessage(socket, { ...args, io }, cb)
  )

  socket.on('new-group', (args, cb) => onNewGroup(socket, args, cb))

  socket.on('send-location', (args) =>
    onLocationChange(socket, { ...args, io })
  )
}
