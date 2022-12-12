import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  connectUserFromLocationSharing,
  disconnectUserFromLocationSharing,
  findGroupsByUserId,
  findGroupsThatLocationIsSharedByUserId,
  findGroupsThatUserIdOwn,
  shareLocationWithAllService,
} from '../services/groupsService.js'

export const getCurrentUserGroups = async (req, res, next) => {
  try {
    const groups = await findGroupsByUserId(req.user.id)
    return res.status(StatusCodes.OK).json({
      groups: groups.map((group) => ({
        ...group,
        members: group.members.map((member) => ({
          ...member,
          position: {
            lat: member.lastKnownLatitude,
            lng: member.lastKnownLongitude,
          },
          lastKnownLatitude: undefined,
          lastKnownLongitude: undefined,
        })),
      })),
      groupsThatOwn: await findGroupsThatUserIdOwn(req.user.id),
      groupsThatLocationIsShared: await findGroupsThatLocationIsSharedByUserId(
        req.user.id
      ),
    })
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}

export const alterGroupLocationSharing = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(
        req.body.connect
          ? await connectUserFromLocationSharing(req.user.id, req.body.groupId)
          : await disconnectUserFromLocationSharing(
              req.user.id,
              req.body.groupId
            )
      )
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const shareLocationWithAll = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await shareLocationWithAllService(req.user.id))
  } catch (error) {
    return next(handleHttpError(error))
  }
}

// endpoint pra definir grupo default
