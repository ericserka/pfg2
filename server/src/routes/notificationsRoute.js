import { Router } from 'express'
import {
  getEmergencyLocations,
  getUserNotifications,
  markUnreadNotificationsAsRead,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)
  notificationsRouter.get('/emergency-locations', getEmergencyLocations)

  app.use('/notifications', notificationsRouter)
}
