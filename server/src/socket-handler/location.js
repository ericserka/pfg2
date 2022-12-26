import { dayjs } from '../helpers/dayjs.js'
import { log } from '../helpers/logger.js'
import { findGroupsThatLocationIsSharedByUserId } from '../services/groupsService.js'
import { findUserById } from '../services/usersService.js'

const onLocationChange = async (socket, io, args) => {
  const { position, userId } = args
  const user = await findUserById(userId)
  const groups = await findGroupsThatLocationIsSharedByUserId(userId)

  const message = {
    timestamp: dayjs().format(),
    userId,
    position,
  }

  if (groups.length) {
    log.info(
      `${socket.id}:${user.username} sent location to ${groups.length} groups`
    )

    io.to(groups.map((g) => g.id)).emit('location-changed', message)
  }
}

export const locationEventListeners = (socket, io) => {
  socket.on('send-location', (args) => onLocationChange(socket, io, args))
}
