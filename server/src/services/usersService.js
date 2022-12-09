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

export const createUser = async (data) => await prisma.user.create({ data })

export const removeUserPassword = (user) => ({ ...user, password: undefined })

export const findUserByIdWithGroups = async (id) =>
  await prisma.user.findUniqueOrThrow({
    where: { id },
    include: { groups: { include: { members: true } } },
  })

export const setGroupAsDefault = async (userId, groupId, tx) =>
  await (tx ?? prisma).user.update({
    where: { id: userId },
    data: { defaultGroupId: groupId },
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
    await setGroupAsDefault(userId, groupId, tx)
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
