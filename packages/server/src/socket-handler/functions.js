import dayjs from '@pfg2/dayjs'

const userSocketMapping = {}

export const onInit = async (socket, args, cb) => {
  socket.join('room')
  console.log(`init socket: ${[...socket.rooms]}`)
  userSocketMapping[socket.id] = args.userId
  cb(socket.connected ? null : { message: 'could not connect' })
}

export const onSendMessage = async (socket, _, cb) => {
  const message = {
    datetime: dayjs().format(),
    userId: userSocketMapping[socket.id],
    position: {
      lat: -15.708972 + Math.random() * 0.02,
      lng: -47.879687 + Math.random() * 0.02,
    },
  }
  console.log(`socket: ${socket.id} sent a message`, message)
  socket.to('room').emit('message-added', message)
  cb(message)
}
