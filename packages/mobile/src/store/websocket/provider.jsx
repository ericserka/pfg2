import { log } from '@pfg2/logger'
import { createContext, useContext, useEffect } from 'react'
import io from 'socket.io-client'
import { SERVER_URL } from '../../constants'

export const socket = io(SERVER_URL, {
  transports: ['websocket'],
})

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

  const emitEventInitSocket = (cb) => {
    socket.emit('init-connection', null, cb)
  }

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

  const emitEventJoinGroup = (userId, code) => {
    socket.emit('join-group', { userId, code })
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        actions: {
          emitEventInitSocket,
          emitEventLocationChanged,
          emitEventSendMessage,
          listenToMessageAdded,
          listenToLocationChanged,
          emitEventJoinGroup,
        },
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
