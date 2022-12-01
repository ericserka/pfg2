import { Router } from 'express'
import {
  getCurrentUserGroups,
  joinGroupByInvite,
} from '../controllers/groupsController.js'

export const useGroupRouter = (app) => {
  const groupsRouter = Router()

  groupsRouter.get('/me', getCurrentUserGroups)
  groupsRouter.post('/join', joinGroupByInvite)

  app.use('/groups', groupsRouter)
}
