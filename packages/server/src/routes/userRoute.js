import { Router } from 'express'
import { getCurrentUser } from '../controllers/userController.js'

export const useUserRouter = (app) => {
  const userRouter = Router()

  userRouter.get('/me', getCurrentUser)

  app.use('/user', userRouter)
}
