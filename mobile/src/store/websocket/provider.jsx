import { createContext, useContext, useEffect, useReducer } from 'react'
import io from 'socket.io-client'
import { SERVER_URL } from '../../constants'
import { log } from '../../helpers/logger'
import { useUserAuth } from '../auth/provider'
import { webSocketReducer } from './reducer'

const WebSocketContext = createContext(null)

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider = ({ children }) => {
  const [socket, dispatch] = useReducer(webSocketReducer, null)

  const {
    state: { session },
  } = useUserAuth()

  const setupSocket = () => {
    if (!socket) {
      log.info(
        `Websocket provider mounted, connecting to socket... Username: ${session.username}`
      )
      const newSocket = io(SERVER_URL)
      newSocket.on('connect', () => {
        log.info(
          `Socket ${newSocket.id} connected. Username: ${session.username}`
        )
        dispatch({ type: 'CONNECT', payload: newSocket })
      })

      newSocket.on('connect_error', () => {
        log.error(`Socket failed to connect. Username: ${session.username}`)
      })

      newSocket.on('disconnect', () => {
        log.info(`Socket disconnected. Username: ${session.username}`)
      })
    }
  }

  const teardownSocket = () => {
    if (socket) {
      log.info(
        `Websocket provider unmounted, disconnecting socket ${socket.id}... Username: ${session.username}`
      )
      socket.offAny()
      socket.disconnect()
      dispatch({ type: 'DISCONNECT' })
    }
  }

  useEffect(() => {
    setupSocket()

    return () => teardownSocket()
  }, [socket])

  const emitEventSendMessage = (message, cb) => {
    socket.emit('send-message', message, cb)
  }

  const listenToMessageAdded = (cb) => {
    socket.on('message-added', cb)
  }

  const unlistenToMessageAdded = () => {
    socket.off('message-added')
  }

  const emitEventLocationChanged = (payload, cb) => {
    socket.emit('send-location', payload)
  }

  const listenToLocationChanged = (cb) => {
    socket.on('location-changed', cb)
  }

  const unlistenToLocationChanged = () => {
    socket.off('location-changed')
  }

  const emitEventJoinGroup = (userId, groupId) => {
    socket.emit('join-group', { userId, groupId })
  }

  const emitEventLeaveChat = (userId, groupId) => {
    socket.emit('leave-chat', { userId, groupId })
  }

  const emitEventRemoveGroupMember = (payload, cb) => {
    socket.emit('remove-group-member', payload, cb)
  }

  const emitEventRejectGroupInvite = (notificationId, cb) => {
    socket.emit('reject-group-invite', { notificationId }, cb)
  }

  const emitEventAcceptGroupInvite = (payload, cb) => {
    socket.emit('accept-group-invite', payload, cb)
  }

  const emitEventAddMembersToGroup = (payload, cb) => {
    socket.emit('add-members-to-group', payload, cb)
  }

  const emitEventCreateGroup = (payload, cb) => {
    socket.emit('create-group', payload, cb)
  }

  const listenToNotificationReceived = (cb) => {
    socket.on('notification-received', cb)
  }

  const unlistenToNotificationReceived = () => {
    socket.off('notification-received')
  }

  const emitEventAskHelp = (payload, cb) => {
    socket.emit('ask-help', payload, cb)
  }

  const emitEventDeleteGroup = (payload, cb) => {
    socket.emit('delete-group', payload, cb)
  }

  const emitEventLeaveGroup = (payload, cb) => {
    socket.emit('leave-group', payload, cb)
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        actions: {
          emitEventLocationChanged,
          emitEventSendMessage,
          listenToMessageAdded,
          unlistenToMessageAdded,
          listenToLocationChanged,
          unlistenToLocationChanged,
          emitEventJoinGroup,
          emitEventLeaveChat,
          emitEventRemoveGroupMember,
          emitEventAcceptGroupInvite,
          emitEventRejectGroupInvite,
          emitEventAddMembersToGroup,
          emitEventCreateGroup,
          listenToNotificationReceived,
          unlistenToNotificationReceived,
          emitEventAskHelp,
          emitEventLeaveGroup,
          emitEventDeleteGroup,
        },
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
