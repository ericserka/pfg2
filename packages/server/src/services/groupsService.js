import { prisma } from '../helpers/prisma.js'

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

export function FindOrCreateGroup(group, userId) {
  return prisma.group.upsert({
    create: {
      ...group,
    },
    where: { id: group?.id ?? -1 },
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
