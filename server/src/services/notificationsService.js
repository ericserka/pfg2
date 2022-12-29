import { PER_PAGE } from '../constants.js'
import { prisma } from '../helpers/prisma.js'
import {
  findGroupById,
  findGroupByIdWithMembersAndMessages,
  linkUserToGroup,
} from './groupsService.js'
import { ifNoGroupsSetNewAsDefault } from './usersService.js'

export const createNotifications = async (data, type, tx) => {
  const dataToInsert = data.map((d) =>
    (tx ?? prisma).notification.create({
      data: { ...d, type, status: type === 'INVITE' ? 'PENDING' : null },
    })
  )
  return tx
    ? await Promise.all(dataToInsert)
    : await prisma.$transaction(dataToInsert)
}

export const getNotificationsByReceiverId = async (userId, page) =>
  await prisma.notification.findMany({
    where: { receiverId: userId },
    include: { sender: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
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
    return await Promise.all([
      findGroupByIdWithMembersAndMessages(groupId, tx),
      findGroupById(groupId),
    ])
  })

export const createEmergencyNotification = async ({ receivers, location }) =>
  await prisma.$transaction(async (tx) => [
    await createNotifications(receivers, 'HELP', tx),
    await saveEmergencyLocation(location, tx),
  ])

export const saveEmergencyLocation = async (location, tx) =>
  await (tx ?? prisma).emergencyLocations.create({
    data: { ...location },
  })

export const getEmergencyNotificationsLocations = async () =>
  await prisma.emergencyLocations.findMany()

export const buildGroupInviteNotificationContent = (groupName, username) =>
  `${username} te convidou para fazer parte do grupo '${groupName}'.`

export const buildHelpNotificationContent = (username) =>
  `${username} solicitou ajuda.`

export const buildMessageNotificationContent = (groupName) =>
  `${groupName} tem novas mensagens.`

export const buildRemovedFromGroupNotificationContent = (groupName, username) =>
  `${username} removeu você do grupo '${groupName}'.`

export const buildNewMessageNotificationContent = (groupName) =>
  `'${groupName}' tem novas mensagens.`

export const getTotalNotificationsByReceiverId = async (receiverId) =>
  await prisma.notification.count({ where: { receiverId } })

export const getNonSeenNotificationsByReceiverId = async (receiverId) =>
  await prisma.notification.count({ where: { receiverId, seen: false } })
