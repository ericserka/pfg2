import { Router } from 'express'
import {
  getUserNotifications,
  markUnreadNotificationsAsRead,
  getEmergencyLocations,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)
  notificationsRouter.get('/emergency-locations', getEmergencyLocations)

  app.use('/notifications', notificationsRouter)
}
