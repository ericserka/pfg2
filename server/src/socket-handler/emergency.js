import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import { removeDuplicateArrayObjectsById } from '../helpers/snippets.js'
import { sendPushNotificationsService } from '../services/expoService.js'
import {
  buildHelpNotificationContent,
  createHelpNotifications,
} from '../services/notificationsService.js'
import { findUserByIdWithGroups } from '../services/usersService.js'

const onAskHelp = async (socket, { user: { id: userId, username } }, cb) => {
  try {
    const sender = await findUserByIdWithGroups(userId)
    const receivers = removeDuplicateArrayObjectsById(
      sender.groups.map((g) => g.members).flat()
    ).filter((user) => user.id !== sender.id)
    const notifications = await createHelpNotifications(
      receivers.map((r) => ({
        receiverId: r.id,
        senderId: sender.id,
        content: buildHelpNotificationContent(username),
      }))
    )
    await sendPushNotificationsService(
      receivers
        .filter((r) => r.pushNotificationAllowed)
        .map((r) => ({
          to: r.pushToken,
          sound: 'default',
          title: 'Pedido de ajuda',
          body: buildHelpNotificationContent(username),
          data: {
            screenName: 'Notificações',
            notification: {
              ...notifications.find((n) => n.receiverId === r.id),
              sender: { username },
            },
          },
        }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({ ...n, sender: { username } })),
    })
    log.info(`User ${userId} asked for help`)
    cb({
      success: true,
      message: 'Solicitação de ajuda enviada com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

export const emergencyEventListeners = (socket) => {
  socket.on('ask-help', (args, cb) => onAskHelp(socket, args, cb))
}
