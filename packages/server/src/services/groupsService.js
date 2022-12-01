import { prisma } from '../helpers/prisma.js'
import { generateToken } from './jwtService.js'
import crypto from 'crypto'

export const findGroupById = async (id) =>
  await prisma.group.findUniqueOrThrow({
    where: {
      id,
    },
  })

export const findGroupByInviteCode = async (code) =>
  await prisma.group.findUniqueOrThrow({
    where: {
      invite_code: code,
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

export const linkUserToGroup = (userId, groupId) =>
  prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
  })

export const generateGroupToken = (groupId) =>
  crypto
    .createHash('md5')
    .update(groupId)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase()
