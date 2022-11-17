import { findUserById } from '../services/userService.js'
import { log } from '@pfg2/logger'

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id)
    const noPasswordUser = { ...user, password: undefined }
    res.status(200).json({ ...noPasswordUser })
  } catch (error) {
    console.log({ error })
    next(error)
  }
}
