import { PER_PAGE } from '../constants.js'
import { prisma } from '../helpers/prisma.js'
import {
  findGroupById,
  findGroupByIdWithMembersAndMessages,
  linkUserToGroup,
} from './groupsService.js'
import { ifNoGroupsSetNewAsDefault } from './usersService.js'

export const createHelpNotifications = async (data, tx) => {
  const dataToInsert = data.map((d) =>
    prisma.notification.create({ data: { ...d, type: 'HELP' } })
  )
  return tx
    ? await Promise.all(dataToInsert)
    : await prisma.$transaction(dataToInsert)
}

export const createInviteNotifications = async (data, tx) => {
  const dataToInsert = data.map((d) =>
    (tx ?? prisma).notification.create({
      data: { ...d, type: 'INVITE', status: 'PENDING' },
    })
  )
  return tx
    ? await Promise.all(dataToInsert)
    : await prisma.$transaction(dataToInsert)
}

export const createRemovedFromGroupNotifications = async (data, tx) => {
  const dataToInsert = data.map((d) =>
    (tx ?? prisma).notification.create({
      data: { ...d, type: 'GROUP_REMOVED' },
    })
  )
  return tx
    ? await Promise.all(dataToInsert)
    : await prisma.$transaction(dataToInsert)
}

export const createMessageNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'MESSAGE' })),
  })

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
      findGroupByIdWithMembersAndMessages(groupId),
      findGroupById(groupId),
    ])
  })

export const createEmergencyNotification = async ({ receivers, location }) => 
  await prisma.$transaction(async (tx) => [
    await createHelpNotifications(receivers, tx),
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

export const getTotalNotificationsByReceiverId = async (receiverId) =>
  await prisma.notification.count({ where: { receiverId } })

export const getNonSeenNotificationsByReceiverId = async (receiverId) =>
  await prisma.notification.count({ where: { receiverId, seen: false } })
