import { Router } from 'express'
import {
  getCurrentUser,
  getUserGroupsAmount,
  saveLastLocation,
  alterPushToken,
  alterPushNotificationsAllowance,
} from '../controllers/usersController.js'

export const useUserRouter = (app) => {
  const usersRouter = Router()

  usersRouter.get('/me', getCurrentUser)
  usersRouter.post('/last-loc', saveLastLocation)
  usersRouter.get('/groups-amount', getUserGroupsAmount)
  usersRouter.patch('/push-token', alterPushToken)
  usersRouter.patch(
    '/push-notifications-allowance',
    alterPushNotificationsAllowance
  )

  app.use('/users', usersRouter)
}
