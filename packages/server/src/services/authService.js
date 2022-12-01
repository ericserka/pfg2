import bcrypt from 'bcrypt'
import { generateToken } from './jwtService.js'

export const generateAuthToken = (user) =>
  generateToken({ id: user.id, email: user.email })

export const verifyCredentials = async (user, password) =>
  await bcrypt.compare(password, user.password)

export const hashPassword = async (password) => await bcrypt.hash(password, 10)
