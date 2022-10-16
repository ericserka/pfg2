import { Router } from 'express'

export const router = Router()

router.get('/', (_, res) => {
  res.json({
    ok: true,
    date: new Date().toLocaleString(),
  })
})

router.get('/eric', (_, res) => {
  res.json({
    message: 'eric ',
  })
})
