import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants.js'

export const generateToken = (payload, config = undefined) =>
  jwt.sign(payload, JWT_SECRET, config)

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET)
