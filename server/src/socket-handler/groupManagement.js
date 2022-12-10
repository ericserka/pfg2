import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import {
  createGroupService,
  unlinkUserFromGroup,
} from '../services/groupsService.js'
import {
  acceptGroupInviteNotificationById,
  buildGroupInviteNotificationContent,
  createInviteNotifications,
  rejectGroupInviteNotificationById,
  sendPushNotifications,
} from '../services/notificationsService.js'
import { getUsersPushTokens } from '../services/usersService.js'

const onRemoveGroupMember = async ({ groupId, userId }, cb) => {
  try {
    await unlinkUserFromGroup(userId, groupId)
    cb({
      success: true,
      message: 'Operação realizada com sucesso.',
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

const onAddMembersToGroup = async (
  socket,
  {
    group: { id: groupId, name: groupName },
    membersToInviteIds,
    user: { id: userId, username },
  },
  cb
) => {
  try {
    await createInviteNotifications(
      membersToInviteIds.map((m) => ({
        receiverId: m,
        senderId: userId,
        groupId: groupId,
        content: buildGroupInviteNotificationContent(groupName, username),
      }))
    )
    await sendPushNotifications(
      'INVITE',
      await getUsersPushTokens(membersToInviteIds),
      groupName,
      username
    )
    socket.broadcast.emit('notification-received', {
      usersIds: membersToInviteIds,
    })
    log.info(
      `User ${userId} invited users ${membersToInviteIds} for group ${groupId}`
    )
    cb({
      success: true,
      message: 'Convites enviados com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

const onCreateGroup = async (
  socket,
  { groupName, membersToInviteIds, user },
  cb
) => {
  try {
    const group = await createGroupService(groupName, user, membersToInviteIds)
    await sendPushNotifications(
      'INVITE',
      await getUsersPushTokens(membersToInviteIds),
      groupName,
      user.username
    )
    socket.broadcast.emit('notification-received', {
      usersIds: membersToInviteIds,
    })
    log.info(
      `User ${user.id} created group ${groupName} with id ${group.id} and invited users ${membersToInviteIds}`
    )
    cb({
      success: true,
      message: 'Grupo criado e convites enviados com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

export const groupManagementEventListeners = (socket) => {
  socket.on('remove-group-member', onRemoveGroupMember)
  socket.on('accept-group-invite', onAcceptGroupInvite)
  socket.on('reject-group-invite', onRejectGroupInvite)
  socket.on('add-members-to-group', (args, cb) =>
    onAddMembersToGroup(socket, args, cb)
  )
  socket.on('create-group', (args, cb) => onCreateGroup(socket, args, cb))
}
