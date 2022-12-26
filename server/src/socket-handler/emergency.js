import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import { removeDuplicateArrayObjectsById } from '../helpers/snippets.js'
import { sendPushNotificationsService } from '../services/expoService.js'
import {
  buildHelpNotificationContent, createEmergencyNotification,
} from '../services/notificationsService.js'
import { findUserByIdWithGroups } from '../services/usersService.js'

const onAskHelp = async (
  socket,
  { user: { id: userId, username }, position: { latitude, longitude } },
  cb
) => {
  try {
    const sender = await findUserByIdWithGroups(userId)
    const receivers = removeDuplicateArrayObjectsById(
      sender.groups.map((g) => g.members).flat()
    ).filter((user) => user.id !== sender.id)
    const [notifications, emergencyLocation] = await createEmergencyNotification({
      receivers: receivers.map((r) => ({
        receiverId: r.id,
        senderId: sender.id,
        content: buildHelpNotificationContent(username),
      })),
      location: { latitude, longitude },
    })
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
          },
        }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({ ...n, sender: { username } })),
      emergencyLocation
    })
    log.info(`User ${userId} asked for help`)
    cb({
      success: true,
      message: 'Solicitação de ajuda enviada com sucesso.',
      emergencyLocation
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

export const emergencyEventListeners = (socket) => {
  socket.on('ask-help', (args, cb) => onAskHelp(socket, args, cb))
}
