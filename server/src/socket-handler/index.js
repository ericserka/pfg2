import { coreEventListeners } from './core.js'
import { emergencyEventListeners } from './emergency.js'
import { groupManagementEventListeners } from './groupManagement.js'
import { locationEventListeners } from './location.js'
import { messagingEventListeners } from './messaging.js'

export const SocketHandler = (socket, io) => {
  coreEventListeners(socket)
  messagingEventListeners(socket)
  locationEventListeners(socket, io)
  groupManagementEventListeners(socket)
  emergencyEventListeners(socket)
}
