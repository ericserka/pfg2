import {
  generateToken,
  hashPassword,
  verifyCredentials,
} from '../services/authService.js'
import { createUser } from '../services/helloService.js'
import { findUserByEmailAddress } from '../services/userService.js'
import { prisma } from '../helpers/prisma.js'

export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await findUserByEmailAddress(email)
    await verifyCredentials(user, password)
    const token = generateToken(user)
    const noPasswordUser = { ...user, password: undefined }
    return res.json({ ...noPasswordUser, token })
  } catch (error) {
    console.error({ error })
    next(error)
  }
}

export const register = async (req, res, next) => {
  const { email, name } = req.body

  let user
  try {
    user = await findUserByEmailAddress(email)
  } catch (error) {}

  try {
    if (user) {
      return next(new Error('User already exists'))
    }
    // const hashedPassword = await hashPassword(password)
    const newUser = await prisma.user.create({ data: { email, name } })
    const token = generateToken(newUser)
    const noPasswordUser = { ...newUser, password: undefined }
    return res.json({ ...noPasswordUser, token })
  } catch (error) {
    console.error({ error })
    return next(error)
  }
}
