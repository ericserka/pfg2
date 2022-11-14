import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import {
  PRISMA_RECORD_NOT_FOUND_ERROR,
  PRISMA_UNIQUE_CONSTRAINT_ERROR,
} from '../constants.js'

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

export const errorMiddleware = (err, response) => {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
  response.status(statusCode).json({
    statusCode,
    message:
      err.message ??
      'Servidor com instabilidade momentânea. Tente novamente mais tarde.',
  })
}

const prismaCustomErrorHandler = (err, customMessage) => {
  switch (err.constructor) {
    case Prisma.PrismaClientInitializationError:
      return new ErrorHandler(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Falha ao tentar conectar ao banco de dados. Tente novamente mais tarde.'
      )
    case Prisma.PrismaClientKnownRequestError:
      switch (err.code) {
        case PRISMA_UNIQUE_CONSTRAINT_ERROR:
          return new ErrorHandler(StatusCodes.CONFLICT, customMessage)
        case PRISMA_RECORD_NOT_FOUND_ERROR:
          return new ErrorHandler(StatusCodes.NOT_FOUND, customMessage)
        default:
          return null
      }
    default:
      return null
  }
}

export const handleError = (err, customMessage) => {
  const prismaError = prismaCustomErrorHandler(err, customMessage)
  return prismaError ? prismaError : new ErrorHandler()
}
