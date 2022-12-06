import { Router } from 'express'
import { login, register } from '../controllers/authController.js'

export const useAuthRouter = (app) => {
  const authRouter = Router()

  authRouter.post('/login', login)

  authRouter.post('/register', register)

  app.use('/auth', authRouter)
}
