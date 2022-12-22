import { Expo } from 'expo-server-sdk'
import { log } from '../helpers/logger.js'

export const sendPushNotificationsService = async (messages) => {
  const expo = new Expo()
  const validMessages = messages.filter((m) => Expo.isExpoPushToken(m.to))

  const chunks = expo.chunkPushNotifications(validMessages)
  const tickets = chunks.map(
    async (c) => await expo.sendPushNotificationsAsync(c)
  )
  const receiptIds = tickets.filter((t) => t?.id).map((t) => t.id)
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
  receiptIdChunks.forEach(async (r) => {
    ;(await expo.getPushNotificationReceiptsAsync(chunk)).forEach(
      ({ status, message, details }) => {
        if (status === 'error') {
          log.error(`There was an error sending a notification: ${message}`)
          if (details && details.error) {
            log.error(`The error code is ${details.error}`)
          }
        }
      }
    )
  })
}
