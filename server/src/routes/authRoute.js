import { Router } from 'express'
import {
  login,
  register,
  saveRandomPassword,
} from '../controllers/authController.js'

export const useAuthRouter = (app) => {
  const authRouter = Router()

  authRouter.post('/login', login)
  authRouter.post('/register', register)
  authRouter.patch('/random-password', saveRandomPassword)

  app.use('/auth', authRouter)
}
