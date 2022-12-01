import { StatusCodes } from 'http-status-codes'
import { handleError } from '../helpers/errors.js'
import {
  findGroupByInviteCode,
  findGroupsByUserId,
  linkUserToGroup,
} from '../services/groupsService.js'

export const getCurrentUserGroups = async (req, res, next) => {
  try {
    return res
      .status(StatusCodes.OK)
      .json(await findGroupsByUserId(req.user.id))
  } catch (error) {
    return next(handleError(error, 'Usuário não encontrado.'))
  }
}

export const joinGroupByInvite = async (req, res, next) => {
  const { code } = req.body
  try {
    const group = await findGroupByInviteCode(code)
    await linkUserToGroup(userId, group.id)
    return res.status(StatusCodes.OK).json({ ok: true })
  } catch (error) {
    return next(handleError(error, 'Falha ao entrar no grupo.'))
  }
}
