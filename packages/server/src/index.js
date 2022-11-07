import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { upperCase } from '@pfg2/snippets'
import { SocketHandler } from './socket-handler/index.js'
import dayjs from '@pfg2/dayjs'
import { useHelloRouter } from './routes/helloRoute.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

useHelloRouter(app)

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', SocketHandler)

server
  .listen(3000, () =>
    console.log(`${upperCase('server running')}: ${dayjs().format()}`)
  )
  .on('error', (err) => console.log({ err }))
