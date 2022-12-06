import { log } from '../helpers/logger.js'

export const coreEventListeners = (socket) => {
  socket.on('init-connection', (_, cb) => {
    log.info(`init socket: ${socket.id}`)
    cb(socket.connected ? null : { message: 'could not connect' })
  })

  socket.on('disconnect', () => {
    log.info(`disconnect socket: ${socket.id}`)
  })
}
