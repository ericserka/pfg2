import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { buildFindAllResponse } from '../services/helloService.js'

export const findAll = async (_req, res) => {
  return res.status(StatusCodes.OK).json(buildFindAllResponse())
}

export const findOne = async (req, res) => {
  return res.status(StatusCodes.OK).json({ message: `hello ${req.params.id}` })
}

export const create = async (req, res) => {
  return res
    .status(StatusCodes.CREATED)
    .json({ status: ReasonPhrases.CREATED, data: req.body })
}

export const update = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    data: req.body,
    idUpdated: req.params.id,
  })
}

export const remove = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    data: req.body,
    idDeleted: req.params.id,
  })
}
