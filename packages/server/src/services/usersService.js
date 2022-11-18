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
