import { log } from '../helpers/logger.js'
import { createMessage } from '../services/messagesService.js'

const onJoinChat = async (socket, { userId, groupId }) => {
  socket.join(groupId)
  log.info(`${socket.id}: User ${userId} connected to group: ${groupId}`)
}

const onLeaveChat = async (socket, { userId, groupId }) => {
  socket.leave(groupId)
  log.info(`${socket.id}: User ${userId} left group: ${groupId}`)
}

const onSendMessage = async (socket, { groupId, userId, content }, cb) => {
  const message = await createMessage({
    content,
    senderId: userId,
    groupId,
  })
  log.info(`${socket.id}: User ${userId} send a message to group: ${groupId}`)
  socket.to(groupId).emit('message-added', message)
  cb(null, message)
}

export const messagingEventListeners = (socket) => {
  socket.on('join-group', (args) => onJoinChat(socket, args))

  socket.on('leave-chat', (args) => onLeaveChat(socket, args))

  socket.on('send-message', (args, cb) => onSendMessage(socket, args, cb))
}
