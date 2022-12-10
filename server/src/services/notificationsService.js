import { prisma } from '../helpers/prisma.js'
import { sendPushNotificationsService } from './expoService.js'
import { linkUserToGroup } from './groupsService.js'
import { ifNoGroupsSetNewAsDefault } from './usersService.js'

export const createHelpNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'HELP' })),
  })

export const createInviteNotifications = async (data, tx) =>
  await (tx ?? prisma).notification.createMany({
    data: data.map((d) => ({ ...d, type: 'INVITE', status: 'PENDING' })),
  })

export const createMessageNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'MESSAGE' })),
  })

export const getNotificationsByReceiverId = async (userId) =>
  await prisma.notification.findMany({
    where: { receiverId: userId },
    include: { sender: true, receiver: true, group: true },
    orderBy: { createdAt: 'desc' },
  })

export const updateUnreadNotificationsToRead = async (
  userId,
  notificationsIds
) =>
  await prisma.notification.updateMany({
    where: { seen: false, receiverId: userId, id: { in: notificationsIds } },
    data: { seen: true },
  })

export const rejectGroupInviteNotificationById = async (id) =>
  await prisma.notification.update({
    where: { id },
    data: { status: 'REJECTED', seen: true },
  })

export const acceptGroupInviteNotificationById = async (
  notificationId,
  groupId,
  userId
) =>
  await prisma.$transaction(async (tx) => {
    await tx.notification.update({
      where: { id: notificationId },
      data: { status: 'ACCEPTED', seen: true },
    })
    await linkUserToGroup(userId, groupId, tx)
    await ifNoGroupsSetNewAsDefault(userId, groupId, tx)
  })

export const buildGroupInviteNotificationContent = (groupName, username) =>
  `${username} te convidou para fazer parte do grupo '${groupName}'.`

export const buildHelpNotificationContent = (username) =>
  `${username} solicitou ajuda.`

export const buildMessageNotificationContent = (groupName) =>
  `${groupName} tem novas mensagens.`

export const sendPushNotifications = async (
  type,
  pushTokens,
  groupName,
  username
) => {
  let title, content
  switch (type) {
    case 'HELP':
      title = 'Pedido de ajuda'
      content = buildHelpNotificationContent(username)
      break

    case 'INVITE':
      title = 'Convite de grupo'
      content = buildGroupInviteNotificationContent(groupName, username)
      break

    case 'MESSAGE':
      title = 'Novas mensagens'
      content = buildMessageNotificationContent(groupName)
      break

    default:
      break
  }
  return await sendPushNotificationsService(pushTokens, title, content, {
    screenName: 'Notificações',
  })
}
