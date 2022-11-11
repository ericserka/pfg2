import { isObject } from '@pfg2/snippets'
import { createUser, findAllUsers } from '../services/helloService.js'

export const findAll = async (_req, response, next) => {
  const result = await findAllUsers()
  return isObject(result)
    ? response.status(result.statusCode).json(result.json)
    : next(result)
}

export const findOne = async (req, response) => {
  return response.status(200).json({ message: `hello ${req.params.id}` })
}

export const create = async (req, response, next) => {
  const result = await createUser(req.body)
  return isObject(result)
    ? response.status(result.statusCode).json(result.json)
    : next(result)
}

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
