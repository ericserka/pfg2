import { log } from '@pfg2/logger'
import { findGroupById, FindOrCreateGroup } from '../services/groupsService.js'
import { findUserById } from '../services/usersService.js'
import { createMessage } from '../services/messagesService.js'

export const onJoinChat = async (socket, args) => {
  const { userId, groupId } = args

  const [user, group] = await Promise.all([
    findUserById(userId),
    findGroupById(groupId),
  ])

  socket.join(group.id)
  log.info(`${socket.id}:${user.username} connected to group: ${group.id}`)
}

export const onLeaveChat = async (socket, args, cb) => {
  const { groupId, userId } = args
  socket.leave(groupId)

  const user = await findUserById(userId)
  if (user) {
    log.info(`${socket.id}:${user.username} left group: ${groupId}`)
    cb(null)
  } else {
    cb({ message: 'user not found' })
  }
}

export const onSendMessage = async (socket, args, cb) => {
  const { groupId, userId, content, socket } = args

  const user = await findUserById(userId)
  const group = await findGroupById(groupId)

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

export async function onNewGroup(socket, args, cb) {
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
