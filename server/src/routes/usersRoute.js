import { Router } from 'express'
import {
  alterPushNotificationsAllowance,
  alterPushToken,
  getCurrentUser,
  saveLastLocation,
  updateUser,
  updateUserPassword,
} from '../controllers/usersController.js'

export const useUserRouter = (app) => {
  const usersRouter = Router()

  usersRouter.get('/me', getCurrentUser)
  usersRouter.post('/last-loc', saveLastLocation)
  usersRouter.patch('/push-token', alterPushToken)
  usersRouter.patch(
    '/push-notifications-allowance',
    alterPushNotificationsAllowance
  )
  usersRouter.patch('/', updateUser)
  usersRouter.patch('/password', updateUserPassword)

  app.use('/users', usersRouter)
}
