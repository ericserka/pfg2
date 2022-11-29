import { Router } from 'express'
import { getCurrentUserGroups } from '../controllers/groupsController.js'

export const useGroupRouter = (app) => {
  const groupsRouter = Router()

  groupsRouter.get('/me', getCurrentUserGroups)

  app.use('/groups', groupsRouter)
}
