import { prisma } from '../helpers/prisma.js'
import {
  buildGroupInviteNotificationContent,
  createInviteNotifications,
} from './notificationsService.js'
import { ifNoGroupsSetNewAsDefault } from './usersService.js'

export const findGroupById = async (id) =>
  await prisma.group.findUniqueOrThrow({
    where: {
      id,
    },
  })

export function findGroupsByUserId(userId) {
  return prisma.group.findMany({
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
          sender: true,
        },
      },
    },
  })
}

export const findGroupsThatLocationIsSharedByUserId = async (userId) =>
  await prisma.group.findMany({
    where: { usersThatLocationIsShared: { some: { id: userId } } },
  })

export const findGroupsThatUserIdOwn = async (userId) =>
  await prisma.group.findMany({
    where: { ownerId: userId },
  })

export async function FindOrCreateGroup(group, userId) {
  const id = !group.id ? (await prisma.group.count()) + 1 : group.id
  return prisma.group.upsert({
    create: {
      ...group,
      id,
      inviteCode: generateGroupToken(id),
    },
    where: { id },
    update: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      messages: {
        include: {
          sender: true,
        },
      },
    },
  })
}

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

export const unlinkUserFromGroup = async (userId, groupId) =>
  await prisma.group.update({
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
    await createInviteNotifications(
      membersToInviteIds.map((m) => ({
        receiverId: m,
        senderId: owner.id,
        groupId: group.id,
        content: buildGroupInviteNotificationContent(groupName, owner.username),
      })),
      tx
    )
    await ifNoGroupsSetNewAsDefault(owner.id, group.id, tx)
    return group
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

export const shareLocationWithAllService = async (userId) =>
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      groupsThatLocationIsShared: {
        connect: (
          await findGroupsByUserId(userId)
        ).map((g) => ({
          id: g.id,
        })),
      },
    },
  })
