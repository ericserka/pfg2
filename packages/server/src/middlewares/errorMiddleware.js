import { StatusCodes } from 'http-status-codes'

export const errorMiddleware = (err, _req, response, _next) => {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
  response.status(statusCode).json({
    statusCode,
    message:
      err.message ??
      'Servidor com instabilidade momentânea. Tente novamente mais tarde.',
  })
}
