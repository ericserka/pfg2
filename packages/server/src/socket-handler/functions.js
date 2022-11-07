import { shuffle } from '@pfg2/snippets'
import dayjs from '@pfg2/dayjs'

export const onInit = async (socket, _, cb) => {
  cb(socket.connected ? null : { message: 'could not connect' })
}

export const onSendMessage = async (socket, _, cb) => {
  const message = {
    datetime: dayjs().format(),
    content: shuffle('médico otorrinolaringologista'),
  }
  socket.emit('hello-from-server', { message: 'hello from server' })
  cb(message)
}
