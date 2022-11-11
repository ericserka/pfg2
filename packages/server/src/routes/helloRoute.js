import { Router } from 'express'
import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/helloController.js'

export const useHelloRouter = (app) => {
  const helloRouter = Router()

  helloRouter.get('/', findAll)
  helloRouter.get('/:id', findOne)
  helloRouter.post('/', create)
  helloRouter.patch('/:id', update)
  helloRouter.delete('/:id', remove)

  app.use('/users', helloRouter)
}
