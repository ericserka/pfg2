import { prisma } from '../helpers/prisma.js'

export function createMessage(message) {
  return prisma.message.create({
    data: message,
    include: {
      sender: true,
    },
  })
}
