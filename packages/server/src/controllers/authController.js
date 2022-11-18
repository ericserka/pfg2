import { StatusCodes } from 'http-status-codes'
import { ErrorHandler, handleError } from '../helpers/errors.js'
import {
  generateToken,
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
      throw new ErrorHandler(StatusCodes.NOT_FOUND, 'Credenciais inválidas.')
    }
    const token = generateToken(user)
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
    const token = generateToken(user)
    return res.json({ ...removeUserPassword(user), token })
  } catch (error) {
    return next(
      handleError(error, 'Usuário com e-mail ou celular já cadastrado.')
    )
  }
}
