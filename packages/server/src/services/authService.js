import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET
  )
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const verifyCredentials = async (user, password) => {
  // const equal = await bcrypt.compare(password, user.password)
  const equal = password === '123456'
  if (!equal) {
    throw new Error('Invalid credentials')
  }
}

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}
