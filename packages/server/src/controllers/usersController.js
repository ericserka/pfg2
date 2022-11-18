import { StatusCodes } from 'http-status-codes'
import { handleError } from '../helpers/errors.js'
import { findUserById, removeUserPassword } from '../services/usersService.js'

export const getCurrentUser = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(removeUserPassword(await findUserById(req.user.id)))
  } catch (error) {
    return next(handleError(error, 'Usuário não encontrado.'))
  }
}
