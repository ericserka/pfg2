import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { PORT } from './constants.js'
import { log } from './helpers/logger.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { useAuthRouter } from './routes/authRoute.js'
import { useGroupRouter } from './routes/groupsRoute.js'
import { useNotificationRouter } from './routes/notificationsRoute.js'
import { useUserRouter } from './routes/usersRoute.js'
import { SocketHandler } from './socket-handler/index.js'

const app = express()

// increasing limit to accept base64 string in request body
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors())
app.use(morgan('dev'))
// app.use(morgan(':date[iso] :method :url :status'))

useAuthRouter(app)

app.use(authMiddleware)

// auth middleware is only applied for routes from here on down
useUserRouter(app)
useGroupRouter(app)
useNotificationRouter(app)

// errorMiddleware must be the last one
app.use(errorMiddleware)

const server = http.createServer(app)

const io = new Server(server, { maxHttpBufferSize: 5e7 })

io.on('connection', (socket) => SocketHandler(socket, io))

server
  .listen(PORT, () => log.info(`server is running on PORT ${PORT}`))
  .on('error', (err) => log.error({ err }))
