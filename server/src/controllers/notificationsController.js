import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  getNonSeenNotificationsByReceiverId,
  getNotificationsByReceiverId,
  getTotalNotificationsByReceiverId,
  updateUnreadNotificationsToRead,
  getEmergencyNotificationsLocations,
} from '../services/notificationsService.js'

export const getUserNotifications = async (req, res, next) => {
  try {
    const page = Number(req.query.page)
    return res.status(StatusCodes.OK).json({
      notifications: await getNotificationsByReceiverId(req.user.id, page),
      total:
        page === 1
          ? await getTotalNotificationsByReceiverId(req.user.id)
          : undefined,
      non_read_notifications_amount:
        page === 1
          ? await getNonSeenNotificationsByReceiverId(req.user.id)
          : undefined,
    })
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

export const getEmergencyLocations = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await getEmergencyNotificationsLocations())
  } catch (error) {
    return next(handleHttpError(error))
  }
}
