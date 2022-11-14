import { StatusCodes } from 'http-status-codes'
import { handleError } from '../helpers/errors.js'
import { prisma } from '../helpers/prisma.js'

export const findAllUsers = async (response, next) => {
  try {
    return response.status(StatusCodes.OK).json(await prisma.user.findMany())
  } catch (err) {
    return next(handleError(err))
  }
}

export const createUser = async (data, response, next) => {
  try {
    return response
      .status(StatusCodes.CREATED)
      .json(await prisma.user.create({ data }))
  } catch (err) {
    return next(
      handleError(err, 'Usuário com e-mail ou celular já cadastrado.')
    )
  }
}
