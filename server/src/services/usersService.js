import { prisma } from '../helpers/prisma.js'

export const findUserByEmailAddress = async (email, selectAll = true) =>
  await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
    select: selectAll ? undefined : { id: true },
  })

export const findUserById = async (id) =>
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  })

export const findUserByUsername = async (username) =>
  await prisma.user.findUniqueOrThrow({
    where: { username },
    select: { id: true, username: true },
  })

export const createUser = async (data) =>
  await prisma.user.create({ data, select: { id: true } })

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
      select: {
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

export const getUsersForPushNotifications = async (usersIds, tx) =>
  await (tx ?? prisma).user.findMany({
    select: { pushToken: true, id: true },
    where: {
      id: { in: usersIds },
      pushNotificationAllowed: true,
    },
  })

export const updateUserService = async (id, data, tx) =>
  await (tx ?? prisma).user.update({
    where: { id },
    data,
    select: { id: true },
  })

export const sanitizeUserForResponse = (user) => ({
  ...user,
  position: {
    lat: user.lastKnownLatitude,
    lng: user.lastKnownLongitude,
  },
  lastKnownLatitude: undefined,
  lastKnownLongitude: undefined,
})
