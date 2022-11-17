import { prisma } from '../helpers/prisma.js'

export const findUserByEmailAddress = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
