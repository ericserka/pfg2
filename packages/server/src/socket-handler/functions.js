import dayjs from '@pfg2/dayjs'

export const onInit = async (socket, _, cb) => {
  socket.join('room')
  console.log(`init socket: ${[...socket.rooms]}`)
  cb(socket.connected ? null : { message: 'could not connect' })
}

export const onSendMessage = async (socket, _, cb) => {
  const message = {
    datetime: dayjs().format(),
    content: 'médico otorrinolaringologista',
  }
  console.log(`socket: ${socket.id} sent a message`)
  socket.to('room').emit('message-added', message)
  cb(message)
}
