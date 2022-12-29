import { log } from '../helpers/logger.js'
import { sendPushNotificationsService } from '../services/expoService.js'
import { onSendMessageService } from '../services/messagesService.js'
import { buildNewMessageNotificationContent } from '../services/notificationsService.js'

const onJoinChat = async (socket, { userId, groupId }) => {
  socket.join(groupId)
  log.info(`${socket.id}: User ${userId} connected to group: ${groupId}`)
}

const onLeaveChat = async (socket, { userId, groupId }) => {
  socket.leave(groupId)
  log.info(`${socket.id}: User ${userId} left group: ${groupId}`)
}

const onSendMessage = async (
  socket,
  {
    group: { id: groupId, name: groupName },
    user: { id: userId, username },
    content,
  },
  cb
) => {
  const [message, notifications, receivers] = await onSendMessageService(
    groupId,
    userId,
    content
  )
  await sendPushNotificationsService(
    receivers
      .filter((r) => r.pushNotificationAllowed)
      .map((r) => ({
        to: r.pushToken,
        sound: 'default',
        title: 'Novas mensagens',
        body: buildNewMessageNotificationContent(groupName),
        data: {
          screenName: 'Notificações',
        },
      }))
  )
  socket.broadcast.emit('notification-received', {
    notifications: notifications.map((n) => ({
      ...n,
      sender: { username: username },
    })),
  })
  socket.to(groupId).emit('message-added', message)
  log.info(`${socket.id}: User ${userId} send a message to group: ${groupId}`)
  cb(null, message)
}

export const messagingEventListeners = (socket) => {
  socket.on('join-group', (args) => onJoinChat(socket, args))

  socket.on('leave-chat', (args) => onLeaveChat(socket, args))

  socket.on('send-message', (args, cb) => onSendMessage(socket, args, cb))
}
