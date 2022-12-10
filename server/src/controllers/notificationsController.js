import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  getNotificationsByReceiverId,
  updateUnreadNotificationsToRead,
} from '../services/notificationsService.js'

export const getUserNotifications = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await getNotificationsByReceiverId(req.user.id))
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const markUnreadNotificationsAsRead = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(
        await updateUnreadNotificationsToRead(
          req.user.id,
          req.body.notificationsIds
        )
      )
  } catch (error) {
    return next(handleHttpError(error))
  }
}
