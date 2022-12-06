import { log } from '@pfg2/logger'
import { prisma } from '../helpers/prisma.js'
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

export const updateUnreadNotificationsToRead = async (userId) =>
  await prisma.notification.updateMany({
    where: { seen: false, receiverId: userId },
    data: { seen: true },
  })

export const countNonReadNotificationsByReceiverId = async (userId) => {
  const count = await prisma.notification.count({
    where: { receiverId: userId, seen: false },
  })
  return count === 0 ? { count: null } : { count }
}

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
