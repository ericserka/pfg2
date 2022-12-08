import { Router } from 'express'
import {
  getUserNotifications,
  markUnreadNotificationsAsRead,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)

  app.use('/notifications', notificationsRouter)
}
