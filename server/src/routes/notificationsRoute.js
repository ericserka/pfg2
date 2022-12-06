import { Router } from 'express'
import {
  askHelp,
  getNonReadNotificationsAmount,
  getUserNotifications,
  markUnreadNotificationsAsRead,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.post('/ask-help', askHelp)
  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)
  notificationsRouter.get('/non-read-amount', getNonReadNotificationsAmount)

  app.use('/notifications', notificationsRouter)
}
