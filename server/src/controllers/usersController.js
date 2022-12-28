import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import { hashPassword } from '../services/authService.js'
import {
  findUserById,
  findUserByUsername,
  removeUserPassword,
  updateUserService,
} from '../services/usersService.js'

export const getCurrentUser = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(removeUserPassword(await findUserById(req.user.id)))
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const updateUser = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await updateUserService(req.user.id, req.body))
  } catch (error) {
    return next(
      handleHttpError(
        error,
        'Usuário com nome de usuário, e-mail ou celular já cadastrado.'
      )
    )
  }
}

export const updateUserPassword = async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json(
      await updateUserService(req.user.id, {
        password: await hashPassword(req.body.password),
      })
    )
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const getUserByUsername = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await findUserByUsername(req.params.username))
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado'))
  }
}
