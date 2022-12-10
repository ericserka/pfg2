import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import { removeDuplicateArrayObjectsById } from '../helpers/snippets.js'
import {
  buildHelpNotificationContent,
  createHelpNotifications,
  sendPushNotifications,
} from '../services/notificationsService.js'
import { findUserByIdWithGroups } from '../services/usersService.js'

const onAskHelp = async (socket, { user: { id: userId, username } }, cb) => {
  try {
    const sender = await findUserByIdWithGroups(userId)
    const receivers = removeDuplicateArrayObjectsById(
      sender.groups.map((g) => g.members).flat()
    ).filter((user) => user.id !== sender.id)
    await createHelpNotifications(
      receivers.map((r) => ({
        receiverId: r.id,
        senderId: sender.id,
        content: buildHelpNotificationContent(username),
      }))
    )
    await sendPushNotifications(
      'HELP',
      receivers
        .filter((r) => r.pushNotificationAllowed)
        .map((r) => r.pushToken),
      undefined,
      username
    )
    socket.broadcast.emit('notification-received', {
      usersIds: receivers.map((r) => r.id),
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
