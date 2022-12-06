import dayjs from '@pfg2/dayjs'
import { log } from '@pfg2/logger'
import { findGroupsByUserId } from '../services/groupsService.js'
import { findUserById } from '../services/usersService.js'

const onLocationChange = async (socket, args) => {
  const { position, userId } = args
  const user = await findUserById(userId)
  const groups = await findGroupsByUserId(userId)

  const message = {
    timestamp: dayjs().format(),
    userId,
    position,
  }

  log.info(
    `${socket.id}:${user.username} sent location to ${groups.length} groups`
  )

  socket.to(groups.map((g) => g.id)).emit('location-changed', message)
}

export const locationEventListeners = (socket) => {
  socket.on('send-location', (args) => onLocationChange(socket, args))
}
