export const onInit = async (socket, _, cb) => {
  cb(socket.connected ? null : { message: 'could not connect' })
}
