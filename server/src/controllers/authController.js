import { StatusCodes } from 'http-status-codes'
import { ErrorHandler, handleHttpError } from '../helpers/errors.js'
import {
  generateAuthToken,
  hashPassword,
  verifyCredentials,
  saveRandomPasswordService,
} from '../services/authService.js'
import {
  createUser,
  findUserByEmailAddress,
  removeUserPassword,
} from '../services/usersService.js'

export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await findUserByEmailAddress(email)
    if (!(await verifyCredentials(user, password))) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Credenciais inválidas.')
    }
    const token = generateAuthToken(user)
    return res
      .status(StatusCodes.OK)
      .json({ ...removeUserPassword(user), token })
  } catch (error) {
    next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const register = async (req, res, next) => {
  try {
    return res.status(StatusCodes.CREATED).json(
      await createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      })
    )
  } catch (error) {
    return next(
      handleHttpError(
        error,
        'Usuário com nome de usuário, e-mail ou celular já cadastrado.'
      )
    )
  }
}

export const saveRandomPassword = async (req, res, next) => {
  const { email, password } = req.body
  try {
    return res
      .status(StatusCodes.OK)
      .json(await saveRandomPasswordService(email, password))
  } catch (error) {
    return next(
      handleHttpError(error, `Usuário de e-mail ${email} não encontrado.`)
    )
  }
}
