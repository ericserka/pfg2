import { log } from '../helpers/logger.js'
import { findGroupById, FindOrCreateGroup } from '../services/groupsService.js'
import { createMessage } from '../services/messagesService.js'
import { findUserById } from '../services/usersService.js'

const onJoinChat = async (socket, args) => {
  const { userId, groupId } = args

  const [user, group] = await Promise.all([
    findUserById(userId),
    findGroupById(groupId),
  ])

  socket.join(group.id)
  log.info(`${socket.id}:${user.username} connected to group: ${group.id}`)
}

const onLeaveChat = async (socket, args) => {
  const { groupId, userId } = args
  socket.leave(groupId)

  const user = await findUserById(userId)
  log.info(`${socket.id}:${user.username} left group: ${groupId}`)
}

const onSendMessage = async (socket, args, cb) => {
  const { groupId, userId, content } = args

  const [user, group] = await Promise.all([
    findUserById(userId),
    findGroupById(groupId),
  ])

  if (user && group) {
    const message = await createMessage({
      content: content,
      sender: {
        connect: {
          id: user.id,
        },
      },
      group: {
        connect: {
          id: group.id,
        },
      },
    })
    log.info(
      `${socket.id}:${user.username} send a message to group: ${groupId}`
    )
    socket.to(group.id).emit('message-added', message)
    cb(null, message)
  } else {
    cb({ message: 'user or group not found' }, null)
  }
}

async function onNewGroup(socket, args, cb) {
  const { userId, name } = args
  const user = await findUserById(userId)

  if (user) {
    const group = await FindOrCreateGroup(
      {
        name: name,
        users: {
          connect: {
            id: userId,
          },
        },
      },
      user.id
    )
    cb(null, group)
  } else {
    cb({ message: 'invalid user' }, null)
  }
}

export const messagingEventListeners = (socket) => {
  socket.on('join-group', (args, cb) => onJoinChat(socket, args))

  socket.on('leave-group', (args, cb) => onLeaveChat(socket, args))

  socket.on('send-message', (args, cb) => onSendMessage(socket, args, cb))

  socket.on('new-group', (args, cb) => onNewGroup(socket, args, cb))
}
