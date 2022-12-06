import { Router } from 'express'
import {
  createGroup,
  getCurrentUserGroups,
  inviteMembersToGroup,
} from '../controllers/groupsController.js'

export const useGroupRouter = (app) => {
  const groupsRouter = Router()

  groupsRouter.get('/me', getCurrentUserGroups)
  groupsRouter.post('/', createGroup)
  groupsRouter.post('/members', inviteMembersToGroup)

  app.use('/groups', groupsRouter)
}
