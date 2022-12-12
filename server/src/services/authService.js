import bcrypt from 'bcrypt'
import { generateToken } from './jwtService.js'
import { findUserByEmailAddress, updateUserService } from './usersService.js'

export const generateAuthToken = (user) =>
  generateToken({ id: user.id, username: user.username })

export const verifyCredentials = async (user, password) =>
  await bcrypt.compare(password, user.password)

export const hashPassword = async (password) => await bcrypt.hash(password, 10)

export const saveRandomPasswordService = async (email, password) => {
  const user = await findUserByEmailAddress(email)
  await updateUserService(user.id, { password: await hashPassword(password) })
}
