import { log } from '../helpers/logger.js'

export const coreEventListeners = (socket) => {
  socket.on('disconnect', (reason) => {
    log.info(`socket disconnected ${reason}: ${socket.id}`)
  })

  socket.on('disconnecting', (reason) => {
    log.info(`socket is disconnecting ${reason}: ${socket.id}`)
  })
}
