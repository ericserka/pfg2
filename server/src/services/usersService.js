import { dayjs } from '../helpers/dayjs.js'
import { prisma } from '../helpers/prisma.js'

export const findUserByEmailAddress = async (email) =>
  await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  })

export const findUserById = async (id) =>
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  })

export const findUserByUsername = async (username) =>
  await prisma.user.findUniqueOrThrow({ where: { username } })

export const createUser = async (data) => await prisma.user.create({ data })

export const removeUserPassword = (user) => ({ ...user, password: undefined })

export const findUserByIdWithGroups = async (id) =>
  await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      groups: {
        include: {
          members: {
            select: {
              id: true,
              pushNotificationAllowed: true,
              pushToken: true,
            },
          },
        },
      },
    },
  })

export const countUsersGroupsAmount = async (id) =>
  (
    await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: { groups: true },
        },
      },
    })
  )._count.groups

export const ifNoGroupsSetNewAsDefault = async (userId, groupId, tx) => {
  if (!(await countUsersGroupsAmount(userId))) {
    await updateUserService(userId, { defaultGroupId: groupId }, tx)
  }
}

export const updateLastLocation = async (id, location) =>
  await prisma.user.update({
    where: { id },
    data: {
      lastKnownLatitude: location.latitude,
      lastKnownLongitude: location.longitude,
      lastKnownLocationUpdatedAt: dayjs().toDate(),
    },
  })

export const updatePushToken = async (id, pushToken) =>
  await prisma.user.update({ where: { id }, data: { pushToken } })

export const updatePushNotificationAllowed = async (
  id,
  pushNotificationAllowed
) =>
  await prisma.user.update({ where: { id }, data: { pushNotificationAllowed } })

export const getUsersForPushNotifications = async (usersIds, tx) =>
  await (tx ?? prisma).user.findMany({
    select: { pushToken: true, id: true },
    where: {
      id: { in: usersIds },
      pushNotificationAllowed: true,
    },
  })

export const updateUserService = async (id, data, tx) =>
  await (tx ?? prisma).user.update({ where: { id }, data })
