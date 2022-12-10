import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import { findGroupsByUserId } from '../services/groupsService.js'

export const getCurrentUserGroups = async (req, res, next) => {
  try {
    const groups = await findGroupsByUserId(req.user.id)
    return res.status(StatusCodes.OK).json(
      groups.map((group) => ({
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
      }))
    )
  } catch (error) {
    return next(handleHttpError(error, 'Usuário não encontrado.'))
  }
}
// endpoint pra definir grupo default
