import { isObject } from '@pfg2/snippets'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../common/prisma.js'
import { ErrorHandler, prismaCustomErrorHandler } from '../helpers/errors.js'
import { PRISMA_UNIQUE_CONSTRAINT_ERROR } from '../constants.js'

export const findAllUsers = async () => {
  let result
  try {
    result = await prisma.user.findMany()
  } catch (e) {
    const prismaError = prismaCustomErrorHandler(e)
    result = prismaError ? prismaError : new ErrorHandler()
  }

  return Array.isArray(result)
    ? { statusCode: StatusCodes.OK, json: result }
    : result
}

export const createUser = async (data) => {
  let result
  try {
    result = await prisma.user.create({ data })
  } catch (e) {
    const prismaError = prismaCustomErrorHandler(e)
    result = prismaError
      ? prismaError
      : e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
      ? new ErrorHandler(StatusCodes.CONFLICT, 'Email already been taken')
      : new ErrorHandler()
  }

  return isObject(result)
    ? { statusCode: StatusCodes.CREATED, json: result }
    : result
}
