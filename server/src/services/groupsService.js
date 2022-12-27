import { prisma } from '../helpers/prisma.js'
import {
  buildGroupInviteNotificationContent,
  buildRemovedFromGroupNotificationContent,
  createInviteNotifications,
  createRemovedFromGroupNotifications,
} from './notificationsService.js'
import {
  getUsersForPushNotifications,
  ifNoGroupsSetNewAsDefault,
} from './usersService.js'

export const findGroupById = async (id) =>
  await prisma.group.findUniqueOrThrow({
    where: {
      id,
    },
  })

export const findGroupByIdWithMembersAndMessages = async (id, tx) =>
  await (tx ?? prisma).group.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      members: true,
      messages: {
        include: {
          sender: { select: { id: true, username: true, createdAt: true } },
        },
      },
    },
  })

export const findGroupsByUserId = (userId) =>
  prisma.group.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      members: true,
      messages: {
        include: {
          sender: { select: { id: true, username: true, createdAt: true } },
        },
      },
    },
  })

export const findGroupsThatLocationIsSharedByUserId = async (userId) =>
  await prisma.group.findMany({
    where: { usersThatLocationIsShared: { some: { id: userId } } },
  })

export const findGroupsThatUserIdOwn = async (userId) =>
  await prisma.group.findMany({
    where: { ownerId: userId },
  })

export const linkUserToGroup = async (userId, groupId, tx) =>
  await (tx ?? prisma).group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
      usersThatLocationIsShared: {
        connect: {
          id: userId,
        },
      },
    },
  })

export const unlinkUserFromGroup = async (userId, groupId, tx) =>
  await (tx ?? prisma).group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
      usersThatLocationIsShared: {
        disconnect: {
          id: userId,
        },
      },
    },
  })

export const createGroupService = async (
  groupName,
  owner,
  membersToInviteIds
) =>
  await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        name: groupName,
        owner: {
          connect: { id: owner.id },
        },
        members: {
          connect: { id: owner.id },
        },
        usersThatLocationIsShared: {
          connect: { id: owner.id },
        },
      },
    })
    const notifications = await createInviteNotifications(
      membersToInviteIds.map((m) => ({
        receiverId: m,
        senderId: owner.id,
        groupId: group.id,
        content: buildGroupInviteNotificationContent(groupName, owner.username),
      })),
      tx
    )
    await ifNoGroupsSetNewAsDefault(owner.id, group.id, tx)
    const groupWithMembersAndMessages =
      await findGroupByIdWithMembersAndMessages(group.id, tx)
    return [groupWithMembersAndMessages, group, notifications]
  })

export const disconnectUserFromLocationSharing = async (userId, groupId) =>
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      usersThatLocationIsShared: {
        disconnect: {
          id: userId,
        },
      },
    },
  })

export const connectUserFromLocationSharing = async (userId, groupId) =>
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      usersThatLocationIsShared: {
        connect: {
          id: userId,
        },
      },
    },
  })

export const getAllGroupsIdsFromUser = async (userId) =>
  await prisma.group.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
    select: { id: true },
  })

export const shareLocationWithAllService = async (userId) =>
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      groupsThatLocationIsShared: {
        connect: (
          await getAllGroupsIdsFromUser(userId)
        ).map((g) => ({
          id: g.id,
        })),
      },
    },
  })

export const sanitizeGroupForResponse = (group) => ({
  ...group,
  members: group.members.map((member) => ({
    ...member,
    position: {
      lat: member.lastKnownLatitude,
      lng: member.lastKnownLongitude,
    },
    lastKnownLatitude: undefined,
    lastKnownLongitude: undefined,
  })),
})

export const deleteGroup = async (groupId, userId, username) =>
  await prisma.$transaction(async (tx) => {
    const group = await findGroupByIdWithMembers(groupId)
    const receivers = group.members.filter((u) => u.id !== userId)
    await tx.group.delete({ where: { id: groupId } })
    const notifications = await createRemovedFromGroupNotifications(
      receivers.map((r) => ({
        receiverId: r.id,
        senderId: userId,
        content: buildRemovedFromGroupNotificationContent(group.name, username),
      })),
      tx
    )
    return [receivers, notifications]
  })

export const findGroupByIdWithMembers = async (id) =>
  await prisma.group.findUniqueOrThrow({
    where: { id },
    include: {
      members: {
        select: { id: true, pushNotificationAllowed: true, pushToken: true },
      },
    },
  })

export const removeMembemberFromGroup = async (
  groupId,
  groupName,
  userId,
  ownerId,
  ownerUsername
) =>
  await prisma.$transaction(async (tx) => {
    await unlinkUserFromGroup(userId, groupId, tx)
    const receivers = await getUsersForPushNotifications([userId], tx)
    const notifications = await createRemovedFromGroupNotifications(
      [
        {
          receiverId: userId,
          senderId: ownerId,
          content: buildRemovedFromGroupNotificationContent(
            groupName,
            ownerUsername
          ),
        },
      ],
      tx
    )
    return [receivers, notifications]
  })
