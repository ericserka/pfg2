import { Router } from 'express'
import { getCurrentUser } from '../controllers/usersController.js'

export const useUserRouter = (app) => {
  const usersRouter = Router()

  usersRouter.get('/me', getCurrentUser)

  app.use('/users', usersRouter)
}
