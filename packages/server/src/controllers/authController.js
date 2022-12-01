import { StatusCodes } from 'http-status-codes'
import { ErrorHandler, handleError } from '../helpers/errors.js'
import {
  generateAuthToken,
  hashPassword,
  verifyCredentials,
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
    next(handleError(error, 'Usuário não encontrado.'))
  }
}

export const register = async (req, res, next) => {
  try {
    const user = await createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    })
    return res.status(StatusCodes.CREATED).json(removeUserPassword(user))
  } catch (error) {
    return next(
      handleError(
        error,
        'Usuário com nome de usuário, e-mail ou celular já cadastrado.'
      )
    )
  }
}
