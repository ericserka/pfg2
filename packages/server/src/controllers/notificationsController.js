import { log } from '@pfg2/logger'
import { removeDuplicateArrayObjectsById } from '@pfg2/snippets'
import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  countNonReadNotificationsByReceiverId,
  createHelpNotifications,
  getNotificationsByReceiverId,
  updateUnreadNotificationsToRead,
} from '../services/notificationsService.js'
import { findUserByIdWithGroups } from '../services/usersService.js'

export const askHelp = async (req, res, next) => {
  try {
    const sender = await findUserByIdWithGroups(req.user.id)
    const receivers = removeDuplicateArrayObjectsById(
      sender.groups.map((g) => g.members).flat()
    ).filter((user) => user.id !== sender.id)
    const { content, latitude, longitude } = req.body
    return res.status(StatusCodes.CREATED).json(
      await createHelpNotifications(
        receivers.map((r) => ({
          receiverId: r.id,
          senderId: sender.id,
          content: content,
          latitude,
          longitude,
        }))
      )
    )
  } catch (error) {
    return next(handleHttpError(error))
  }
}

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
      .json(await updateUnreadNotificationsToRead(req.user.id))
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const getNonReadNotificationsAmount = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await countNonReadNotificationsByReceiverId(req.user.id))
  } catch (error) {
    return next(handleHttpError(error))
  }
}
