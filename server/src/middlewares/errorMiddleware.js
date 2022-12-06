import {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_ERROR_STATUS_CODE,
} from '../constants.js'

export const errorMiddleware = (err, _req, response, _next) => {
  const statusCode = err.statusCode ?? DEFAULT_ERROR_STATUS_CODE
  response.status(statusCode).json({
    statusCode,
    message: err.message ?? DEFAULT_ERROR_MESSAGE,
  })
}
