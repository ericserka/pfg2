import { dayjs } from '../helpers/dayjs.js'
import { log } from '../helpers/logger.js'
import { findGroupsThatLocationIsSharedByUserId } from '../services/groupsService.js'
import { updateUserService } from '../services/usersService.js'

const onLocationChange = async (
  socket,
  io,
  { position, userId, lastKnownPosition }
) => {
  const groups = await findGroupsThatLocationIsSharedByUserId(userId)

  const message = {
    timestamp: dayjs().format(),
    userId,
    position,
  }

  if (lastKnownPosition) {
    await updateUserService(userId, {
      lastKnownLatitude: position.latitude,
      lastKnownLongitude: position.longitude,
      lastKnownLocationUpdatedAt: dayjs().toDate(),
    })
  }

  if (groups.length) {
    log.info(
      `${socket.id}: User ${userId} sent location to ${groups.length} groups`
    )

    io.to(groups.map((g) => g.id)).emit('location-changed', message)
  }
}

export const locationEventListeners = (socket, io) => {
  socket.on('send-location', (args) => onLocationChange(socket, io, args))
}
