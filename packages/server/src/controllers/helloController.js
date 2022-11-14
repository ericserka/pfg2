import { createUser, findAllUsers } from '../services/helloService.js'

export const findAll = async (_req, response, next) =>
  findAllUsers(response, next)

export const findOne = async (req, response) => {
  return response.status(200).json({ message: `hello ${req.params.id}` })
}

export const create = async (req, response, next) =>
  createUser(req.body, response, next)

export const update = async (req, response) => {
  return response.status(200).json({
    status: 'ok',
    data: req.body,
    idUpdated: req.params.id,
  })
}

export const remove = async (req, response) => {
  return response.status(200).json({
    status: 'ok',
    data: req.body,
    idDeleted: req.params.id,
  })
}
