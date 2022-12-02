import { log } from '@pfg2/logger'
import { removeDuplicateArrayObjectsById } from '@pfg2/snippets'
import { StatusCodes } from 'http-status-codes'
import { handleError } from '../helpers/errors.js'
import {
  acceptGroupInviteNotificationByIds,
  countNonReadNotificationsByReceiverId,
  createHelpNotifications,
  getNotificationsByReceiverId,
  rejectGroupInviteNotificationById,
  updateUnreadNotificationsToRead,
} from '../services/notificationsService.js'
import { findUserByIdWithGroups } from '../services/usersService.js'

export const askHelp = async (req, res, next) => {
  const sender = await findUserByIdWithGroups(req.user.id)
  log.debug()
  const receivers = removeDuplicateArrayObjectsById(
    sender.groups.map((g) => g.members).flat()
  ).filter((user) => user.id !== sender.id)
  try {
    return res.status(StatusCodes.CREATED).json(
      await createHelpNotifications(
        receivers.map((r) => ({
          receiverId: r.id,
          senderId: sender.id,
          content: req.body.content,
        }))
      )
    )
  } catch (error) {
    return next(handleError(error))
  }
}

export const getUserNotifications = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await getNotificationsByReceiverId(req.user.id))
  } catch (error) {
    return next(handleError(error))
  }
}

export const markUnreadNotificationsAsRead = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await updateUnreadNotificationsToRead(req.user.id))
  } catch (error) {
    return next(handleError(error))
  }
}

export const getNonReadNotificationsAmount = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await countNonReadNotificationsByReceiverId(req.user.id))
  } catch (error) {
    return next(handleError(error))
  }
}

export const rejectGroupInvite = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await rejectGroupInviteNotificationById(Number(req.params.id)))
  } catch (error) {
    return next(handleError(error, 'Notificação não encontrada.'))
  }
}

export const acceptGroupInvite = async (req, res, next) => {
  try {
    const { groupId, notificationId } = req.body
    return res
      .status(StatusCodes.OK)
      .json(
        await acceptGroupInviteNotificationByIds(
          notificationId,
          groupId,
          req.user.id
        )
      )
  } catch (error) {
    return next(handleError(error, 'Grupo ou notificação não encontrado.'))
  }
}

// send invite notification
