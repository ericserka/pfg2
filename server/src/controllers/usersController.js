import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  countUsersGroupsAmount,
  findUserById,
  removeUserPassword,
  updateLastLocation,
  updatePushNotificationAllowed,
  updatePushToken,
} from '../services/usersService.js'

export const getCurrentUser = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(removeUserPassword(await findUserById(req.user.id)))
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const getUserGroupsAmount = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json({ count: await countUsersGroupsAmount(req.user.id) })
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const saveLastLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body
    await updateLastLocation(req.user.id, { latitude, longitude })
    return res.status(StatusCodes.OK).json({ ok: true })
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const alterPushToken = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await updatePushToken(req.user.id, req.body.pushToken))
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const alterPushNotificationsAllowance = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(
        await updatePushNotificationAllowed(
          req.user.id,
          req.body.pushNotificationAllowed
        )
      )
  } catch (error) {
    return next(handleHttpError(error))
  }
}
