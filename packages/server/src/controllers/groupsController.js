import { StatusCodes } from 'http-status-codes'
import { handleHttpError } from '../helpers/errors.js'
import {
  createGroupService,
  findGroupsByUserId,
} from '../services/groupsService.js'
import { createInviteNotifications } from '../services/notificationsService.js'

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

export const createGroup = async (req, res, next) => {
  // se o usuario nao tiver nenhum grupo, tornar esse grupo criado o grupo default
  try {
    const { name, membersToInviteIds } = req.body
    return res
      .status(StatusCodes.CREATED)
      .json(await createGroupService(name, req.user, membersToInviteIds))
  } catch (error) {
    return next(handleHttpError(error))
  }
}

export const inviteMembersToGroup = async (req, res, next) => {
  try {
    const {
      group: { id: groupId, name: groupName },
      membersToInviteIds,
    } = req.body
    const { id, username } = req.user
    return res.status(StatusCodes.OK).json(
      await createInviteNotifications(
        membersToInviteIds.map((m) => ({
          receiverId: m,
          senderId: id,
          groupId: groupId,
          content: `${username} te convidou para fazer parte do grupo '${groupName}'`,
        }))
      )
    )
  } catch (error) {
    return next(handleHttpError(error))
  }
}
// endpoint pra definir grupo default
