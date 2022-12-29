import { prisma } from '../helpers/prisma.js'
import { findGroupByIdWithMembers } from './groupsService.js'
import {
  buildNewMessageNotificationContent,
  createNotifications,
} from './notificationsService.js'

export const createMessage = (data, tx) =>
  (tx ?? prisma).message.create({
    data,
    include: {
      sender: { select: { id: true, username: true } },
    },
  })

export const onSendMessageService = async (groupId, userId, content) =>
  await prisma.$transaction(async (tx) => {
    const message = await createMessage(
      {
        content,
        senderId: userId,
        groupId,
      },
      tx
    )
    const group = await findGroupByIdWithMembers(groupId)
    const receivers = group.members.filter((m) => m.id !== userId)
    const notifications = await createNotifications(
      receivers.map((r) => ({
        receiverId: r.id,
        senderId: userId,
        groupId,
        content: buildNewMessageNotificationContent(group.name),
      })),
      'MESSAGE',
      tx
    )
    return [message, notifications, receivers]
  })
