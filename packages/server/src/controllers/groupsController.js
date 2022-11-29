import { StatusCodes } from 'http-status-codes'
import { handleError } from '../helpers/errors.js'
import { findGroupsByUserId } from '../services/groupsService.js'

export const getCurrentUserGroups = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await findGroupsByUserId(req.user.id))
  } catch (error) {
    return next(handleError(error, 'Usuário não encontrado.'))
  }
}
