import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import { unlinkUserFromGroup } from '../services/groupsService.js'
import {
  acceptGroupInviteNotificationById,
  rejectGroupInviteNotificationById,
} from '../services/notificationsService.js'

const onRemoveGroupMember = async ({ groupId, userId }, cb) => {
  try {
    await unlinkUserFromGroup(userId, groupId)
    cb({
      success: true,
      message: 'Usuário removido do grupo com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error, 'Usuário ou grupo não encontrado.'))
  }
}

const onRejectGroupInvite = async ({ notificationId }, cb) => {
  try {
    await rejectGroupInviteNotificationById(notificationId)
    log.info(`Group invite ${notificationId} rejected`)
    cb({
      success: true,
      message: 'Convite rejeitado com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error, 'Notificação não encontrada.'))
  }
}

const onAcceptGroupInvite = async ({ groupId, notificationId, userId }, cb) => {
  try {
    await acceptGroupInviteNotificationById(notificationId, groupId, userId)
    log.info(
      `User ${userId} accepted group invite ${notificationId} for group ${groupId}`
    )
    cb({
      success: true,
      message: 'Convite aceito com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error, 'Grupo ou notificação não encontrado.'))
  }
}

export const groupManagementEventListeners = (socket) => {
  socket.on('remove-group-member', onRemoveGroupMember)
  socket.on('accept-group-invite', onAcceptGroupInvite)
  socket.on('reject-group-invite', onRejectGroupInvite)
}
