import { verifyToken } from '../services/authService.js'

export const authMiddleware = (req, res, next) => {
  const token = req?.headers?.authorization
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = verifyToken(token.split('Bearer')[1].trim())
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
