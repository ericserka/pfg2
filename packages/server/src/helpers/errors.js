import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Prisma } from '@prisma/client'

export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

export const handleError = (err, response) => {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
  response.status(statusCode).json({
    statusCode,
    message: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
  })
}

export const prismaCustomErrorHandler = (err) => {
  switch (err.constructor) {
    case Prisma.PrismaClientInitializationError:
      return new ErrorHandler(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to connect to the database. Try again later.'
      )
    default:
      return null
  }
}
