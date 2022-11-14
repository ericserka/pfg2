import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  emitEventDisconnect,
  emitEventInitSocket,
  emitEventSendMessage,
  listenToHelloFromServerEvent,
} from '../services/api/socket'
import { useUserAuth } from '../store/auth/provider'
import { Map } from '../components/Map'
import { log } from '@pfg2/logger'

export const Home = () => {
  const {
    authState: { session },
  } = useUserAuth()

  const [group, setGroup] = useState({
    id: 'aoiusdsioad834983',
    name: 'grupo 1',
    users: [
      {
        id: '213sfggcxzas35',
        name: 'Eric',
        email: 'eric@email.com',
        avatar_url: 'https://avatars.githubusercontent.com/u/45241755?v=4',
        position: {
          lat: -15.708972,
          lng: -47.879687,
        },
      },
    ],
  })

  useEffect(() => {
    let interval
    emitEventInitSocket(session.id, (err) => {
      if (err) {
        console.error({ err })
      }

      interval = setInterval(() => {
        emitEventSendMessage((message) => {
          setGroup((prev) => ({
            ...prev,
            users: group.users.map((u) =>
              u.id === message.userId
                ? {
                    ...u,
                    position: message.position,
                  }
                : u
            ),
          }))
        })
      }, 3000)

      listenToHelloFromServerEvent((message) => {
        log.info('processing new message from ', message.userId)
      })
    })

    return () => {
      clearInterval(interval)
      emitEventDisconnect()
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Map group={group} />
    </SafeAreaView>
  )
}
