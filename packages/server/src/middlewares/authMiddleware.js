import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '../services/authService.js'
import { ErrorHandler } from '../helpers/errors.js'

export const authMiddleware = (req, res, next) => {
  const token = req?.headers?.authorization
  if (!token) {
    throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }
  try {
    req.user = verifyToken(token.split('Bearer')[1].trim())
    next()
  } catch (_error) {
    throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }
}
