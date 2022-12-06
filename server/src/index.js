import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { log } from './helpers/logger.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { useAuthRouter } from './routes/authRoute.js'
import { useGroupRouter } from './routes/groupsRoute.js'
import { useNotificationRouter } from './routes/notificationsRoute.js'
import { useUserRouter } from './routes/usersRoute.js'
import { acceptGroupInviteNotificationById } from './services/notificationsService.js'
import { SocketHandler } from './socket-handler/index.js'

const app = express()

// increasing limit to accept base64 string in request body
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors())
app.use(morgan('dev'))

useAuthRouter(app)

app.use(authMiddleware)

// auth middleware is only applied for routes from here on down
useUserRouter(app)
useGroupRouter(app)
useNotificationRouter(app)

app.get('/', async (_req, res) => {
  res.json(await acceptGroupInviteNotificationById(34, 12, 24))
})

// errorMiddleware must be the last one
app.use(errorMiddleware)

const server = http.createServer(app)

const io = new Server(server)

io.on('connection', (socket) => SocketHandler(socket, io))

server
  .listen(3000, () => log.info('server is running'))
  .on('error', (err) => log.error({ err }))
