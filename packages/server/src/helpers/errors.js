import { log } from '@pfg2/logger'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import {
  PRISMA_RECORD_NOT_FOUND_ERROR,
  PRISMA_UNIQUE_CONSTRAINT_ERROR,
} from '../constants.js'

export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

export const handleError = (err, customMessage) => {
  log.error(err)
  switch (err.constructor) {
    case ErrorHandler:
      return err
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
    case Prisma.NotFoundError:
      return new ErrorHandler(StatusCodes.NOT_FOUND, customMessage)
    case Prisma.PrismaClientValidationError:
      return new ErrorHandler(StatusCodes.BAD_REQUEST, 'Requisição inválida.')
    default:
      return new ErrorHandler()
  }
}
