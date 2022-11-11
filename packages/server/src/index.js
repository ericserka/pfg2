import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { handleError } from './helpers/errors.js'
import { useHelloRouter } from './routes/helloRoute.js'
import { SocketHandler } from './socket-handler/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

useHelloRouter(app)

const server = http.createServer(app)

app.use((err, _req, response, _next) => {
  handleError(err, response)
})

const io = new Server(server)

io.on('connection', SocketHandler)

server
  .listen(3000, () => console.log('server is running'))
  .on('error', (err) => console.log({ err }))
