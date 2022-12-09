import { Router } from 'express'
import {
  getUserNotifications,
  markUnreadNotificationsAsRead,
  sendPushNotifications,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)
  notificationsRouter.post('/push', sendPushNotifications)

  app.use('/notifications', notificationsRouter)
}
