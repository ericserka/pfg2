import { Router } from 'express'
import {
  getCurrentUserGroups,
  alterGroupLocationSharing,
  shareLocationWithAll,
} from '../controllers/groupsController.js'

export const useGroupRouter = (app) => {
  const groupsRouter = Router()

  groupsRouter.get('/me', getCurrentUserGroups)
  groupsRouter.patch('/alter-group-location-sharing', alterGroupLocationSharing)
  groupsRouter.patch('/share-location-with-all', shareLocationWithAll)

  app.use('/groups', groupsRouter)
}
