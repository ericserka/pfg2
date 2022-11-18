import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_SECRET } from '../constants.js'

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET
  )

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET)

export const verifyCredentials = async (user, password) =>
  await bcrypt.compare(password, user.password)

export const hashPassword = async (password) => await bcrypt.hash(password, 10)
