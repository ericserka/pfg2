import { handleSocketIOError } from '../helpers/errors.js'
import { log } from '../helpers/logger.js'
import { sendPushNotificationsService } from '../services/expoService.js'
import {
  createGroupService,
  deleteGroup,
  removeMembemberFromGroup,
  sanitizeGroupForResponse,
  unlinkUserFromGroup,
} from '../services/groupsService.js'
import {
  acceptGroupInviteNotificationById,
  buildGroupInviteNotificationContent,
  buildRemovedFromGroupNotificationContent,
  createNotifications,
  rejectGroupInviteNotificationById,
} from '../services/notificationsService.js'
import { getUsersForPushNotifications, findUserById, sanitizeUserForResponse } from '../services/usersService.js'

const onRemoveGroupMember = async (
  socket,
  {
    group: { id: groupId, name: groupName },
    owner: { id: ownerId, username: ownerUsername },
    userId,
  },
  cb
) => {
  try {
    const [receivers, notifications] = await removeMembemberFromGroup(
      groupId,
      groupName,
      userId,
      ownerId,
      ownerUsername
    )
    log.info(`User ${ownerId} removed user ${userId} from group ${groupId}`)
    await sendPushNotificationsService(
      receivers.map((r) => ({
        to: r.pushToken,
        sound: 'default',
        title: 'Removido de grupo',
        body: buildRemovedFromGroupNotificationContent(
          groupName,
          ownerUsername
        ),
        data: {
          screenName: 'Notificações',
        },
      }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({
        ...n,
        sender: { username: ownerUsername },
      })),
      removedFromGroup: groupId,
    })
    cb({
      success: true,
      message: 'Membro removido com sucesso.',
    })
    socket.broadcast.emit('user-left-group', {
      userId,
      groupId,
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

const onAcceptGroupInvite = async (socket, { groupId, notificationId, userId }, cb) => {
  try {
    const [[groupWithMembersAndMessages, group], user] = await Promise.all([
      acceptGroupInviteNotificationById(notificationId, groupId, userId),
      findUserById(userId)
    ])
    log.info(
      `User ${userId} accepted group invite ${notificationId} for group ${groupId}`
    )
    cb({
      success: true,
      message: 'Convite aceito com sucesso.',
      data: {
        group,
        groupWithMembersAndMessages: sanitizeGroupForResponse(
          groupWithMembersAndMessages
        ),
      },
    })
    socket.broadcast.emit('user-joined-group', {
      user: sanitizeUserForResponse(user),
      groupId,
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
    const notifications = await createNotifications(
      membersToInviteIds.map((m) => ({
        receiverId: m,
        senderId: userId,
        groupId: groupId,
        content: buildGroupInviteNotificationContent(groupName, username),
      })),
      'INVITE'
    )
    await sendPushNotificationsService(
      (
        await getUsersForPushNotifications(membersToInviteIds)
      ).map((r) => ({
        to: r.pushToken,
        sound: 'default',
        title: 'Convite de grupo',
        body: buildGroupInviteNotificationContent(groupName, username),
        data: {
          screenName: 'Notificações',
        },
      }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({
        ...n,
        sender: { username },
      })),
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
    const [groupWithMembersAndMessages, group, notifications] =
      await createGroupService(groupName, user, membersToInviteIds)
    await sendPushNotificationsService(
      (
        await getUsersForPushNotifications(membersToInviteIds)
      ).map((r) => ({
        to: r.pushToken,
        sound: 'default',
        title: 'Convite de grupo',
        body: buildGroupInviteNotificationContent(groupName, user.username),
        data: {
          screenName: 'Notificações',
        },
      }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({
        ...n,
        sender: { username: user.username },
      })),
    })
    log.info(
      `User ${user.id} created group ${groupName} with id ${group.id} and invited users ${membersToInviteIds}`
    )
    cb({
      success: true,
      message: 'Grupo criado e convites enviados com sucesso.',
      data: {
        group,
        groupWithMembersAndMessages: sanitizeGroupForResponse(
          groupWithMembersAndMessages
        ),
      },
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

const onDeleteGroup = async (
  socket,
  { group: { id: groupId, name: groupName }, user: { id: userId, username } },
  cb
) => {
  try {
    const [receivers, notifications] = await deleteGroup(
      groupId,
      userId,
      username
    )
    await sendPushNotificationsService(
      receivers
        .filter((r) => r.pushNotificationAllowed)
        .map((r) => ({
          to: r.pushToken,
          sound: 'default',
          title: 'Removido de grupo',
          body: buildRemovedFromGroupNotificationContent(groupName, username),
          data: {
            screenName: 'Notificações',
          },
        }))
    )
    socket.broadcast.emit('notification-received', {
      notifications: notifications.map((n) => ({
        ...n,
        sender: { username },
      })),
      removedFromGroup: groupId,
    })
    log.info(`User ${userId} removed group ${groupId}`)
    cb({
      success: true,
      message: 'Grupo removido com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

const onLeaveGroup = async (socket, { groupId, userId }, cb) => {
  await unlinkUserFromGroup(userId, groupId)
  try {
    log.info(`User ${userId} left group ${groupId}`)
    socket.broadcast.emit('user-left-group', {
      userId,
      groupId,
    })
    cb({
      success: true,
      message: 'Saiu do grupo com sucesso.',
    })
  } catch (error) {
    cb(handleSocketIOError(error))
  }
}

export const groupManagementEventListeners = (socket) => {
  socket.on('remove-group-member', (args, cb) =>
    onRemoveGroupMember(socket, args, cb)
  )
  socket.on('accept-group-invite', (args, cb) => onAcceptGroupInvite(socket, args, cb))
  socket.on('reject-group-invite', onRejectGroupInvite)
  socket.on('add-members-to-group', (args, cb) =>
    onAddMembersToGroup(socket, args, cb)
  )
  socket.on('create-group', (args, cb) => onCreateGroup(socket, args, cb))
  socket.on('delete-group', (args, cb) => onDeleteGroup(socket, args, cb))
  socket.on('leave-group', (args, cb) => onLeaveGroup(socket, args, cb))
}
