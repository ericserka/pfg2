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

export const countUsersGroupsAmount = async (userId, tx) =>
  (
    await (tx ?? prisma).user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        _count: {
          select: { groups: true },
        },
      },
    })
  )._count.groups

export const ifNoGroupsSetNewAsDefault = async (userId, groupId, tx) => {
  if (!(await countUsersGroupsAmount(userId, tx))) {
    await setGroupAsDefault(userId, groupId, tx)
  }
}

export const updateLastLocation = async (userId, location) =>
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastKnownLatitude: location.latitude,
      lastKnownLongitude: location.longitude,
      lastKnownLocationUpdatedAt: dayjs().toDate(),
    },
  })
