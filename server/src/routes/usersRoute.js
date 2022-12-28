import { Router } from 'express'
import {
  getCurrentUser,
  getUserByUsername,
  updateUser,
  updateUserPassword,
} from '../controllers/usersController.js'

export const useUserRouter = (app) => {
  const usersRouter = Router()

  usersRouter.get('/me', getCurrentUser)
  usersRouter.patch('/', updateUser)
  usersRouter.patch('/password', updateUserPassword)
  usersRouter.get('/username/:username', getUserByUsername)

  app.use('/users', usersRouter)
}
