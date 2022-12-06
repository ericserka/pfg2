import { createContext, useContext, useEffect } from 'react'
import io from 'socket.io-client'
import { SERVER_URL } from '../../constants'
import { log } from '../../helpers/logger'

export const socket = io(SERVER_URL)

const WebSocketContext = createContext({
  socket,
})

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on('connect', () => {
      log.info('Socket connected')
    })

    socket.on('disconnect', () => {
      log.info('Socket disconnected')
    })

    return () => {
      socket.disconnect()
      socket.offAny()
    }
  }, [])

  const emitEventSendMessage = (message, cb) => {
    socket.emit('send-message', message, cb)
  }

  const listenToMessageAdded = (cb) => {
    socket.on('message-added', cb)
  }

  const emitEventLocationChanged = (payload, cb) => {
    socket.emit('send-location', payload)
  }

  const listenToLocationChanged = (cb) => {
    socket.on('location-changed', cb)
  }

  const emitEventJoinGroup = (userId, groupId) => {
    socket.emit('join-group', { userId, groupId })
  }

  const emitEventLeaveGroup = (userId, groupId) => {
    socket.emit('leave-group', { userId, groupId })
  }

  const emitEventRemoveGroupMember = (groupId, userId, cb) => {
    socket.emit('remove-group-member', { groupId, userId }, cb)
  }

  const emitEventRejectGroupInvite = (notificationId, cb) => {
    socket.emit('reject-group-invite', { notificationId }, cb)
  }

  const emitEventAcceptGroupInvite = (notificationId, groupId, userId, cb) => {
    socket.emit('accept-group-invite', { notificationId, groupId, userId }, cb)
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        actions: {
          emitEventLocationChanged,
          emitEventSendMessage,
          listenToMessageAdded,
          listenToLocationChanged,
          emitEventJoinGroup,
          emitEventLeaveGroup,
          emitEventRemoveGroupMember,
          emitEventAcceptGroupInvite,
          emitEventRejectGroupInvite,
        },
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
