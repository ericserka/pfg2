import { Router } from 'express'
import {
  getCurrentUser,
  getUserGroupsAmount,
  saveLastLocation,
} from '../controllers/usersController.js'

export const useUserRouter = (app) => {
  const usersRouter = Router()

  usersRouter.get('/me', getCurrentUser)
  usersRouter.post('/last-loc', saveLastLocation)
  usersRouter.get('/groups-amount', getUserGroupsAmount)

  app.use('/users', usersRouter)
}
