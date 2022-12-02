import { prisma } from '../helpers/prisma.js'
import { linkUserToGroup } from './groupsService.js'

export const createHelpNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'HELP' })),
  })

export const createInviteNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'INVITE' })),
  })

export const createMessageNotifications = async (data) =>
  await prisma.notification.createMany({
    data: data.map((d) => ({ ...d, type: 'MESSAGE' })),
  })

export const getNotificationsByReceiverId = async (userId) =>
  await prisma.notification.findMany({
    where: { receiverId: userId },
    include: { sender: true, receiver: true, group: true },
  })

export const updateUnreadNotificationsToRead = async (userId) =>
  await prisma.notification.updateMany({
    where: { seen: false, receiverId: userId },
    data: { seen: true },
  })

export const countNonReadNotificationsByReceiverId = async (userId) => {
  const count = (
    await prisma.notification.aggregate({
      _count: {
        seen: true,
      },
      where: { receiverId: userId, seen: false },
    })
  )._count.seen
  return count === 0 ? { count: null } : { count }
}

export const rejectGroupInviteNotificationById = async (id) =>
  await prisma.notification.update({
    where: { id },
    data: { status: 'REJECTED' },
  })

export const acceptGroupInviteNotificationByIds = async (
  notificationId,
  groupId,
  userId
) =>
  await prisma.$transaction([
    prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'ACCEPTED' },
    }),
    linkUserToGroup(userId, groupId),
  ])
