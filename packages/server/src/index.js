import { log } from '@pfg2/logger'
import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { useHelloRouter } from './routes/helloRoute.js'
import { useAuthRouter } from './routes/authRoute.js'
import { SocketHandler } from './socket-handler/index.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { useUserRouter } from './routes/userRoute.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

useAuthRouter(app)

app.use(authMiddleware)

// auth middleware is only applied for routes from here on down
useHelloRouter(app)
useUserRouter(app)

// errorMiddleware must be the last one
app.use(errorMiddleware)

const server = http.createServer(app)

const io = new Server(server)

io.on('connection', SocketHandler)

server
  .listen(3000, () => log.info('server is running'))
  .on('error', (err) => log.error({ err }))
