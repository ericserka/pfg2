import { Router } from 'express'
import {
  askHelp,
  getUserNotifications,
  markUnreadNotificationsAsRead,
  getNonReadNotificationsAmount,
  acceptGroupInvite,
  rejectGroupInvite,
} from '../controllers/notificationsController.js'

export const useNotificationRouter = (app) => {
  const notificationsRouter = Router()

  notificationsRouter.post('/ask-help', askHelp)
  notificationsRouter.get('/', getUserNotifications)
  notificationsRouter.patch('/unread-to-read', markUnreadNotificationsAsRead)
  notificationsRouter.get('/non-read-amount', getNonReadNotificationsAmount)
  notificationsRouter.patch('/accept-group-invite', acceptGroupInvite)
  notificationsRouter.patch('/reject-group-invite/:id', rejectGroupInvite)

  app.use('/notifications', notificationsRouter)
}
