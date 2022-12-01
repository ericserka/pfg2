import dayjs from '@pfg2/dayjs'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { notificationsReducer } from './reducer'

const notificationsInitialState = {
  mutationLoading: false,
  queryLoading: false,
  notifications: undefined,
  non_read_notifications_amount: null,
}

const NotificationsContext = createContext({
  state: { ...notificationsInitialState },
})

export const useNotifications = () => useContext(NotificationsContext)

export const NotificationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    notificationsReducer,
    notificationsInitialState
  )

  const getNonReadNotificationsAmount = async () => {
    try {
      console.log('pegando qtd de notificacoes nao lidas...')
      dispatch({
        type: 'SET_NON_READ_NOTIFICATIONS_AMOUNT',
        payload: 34,
      })
    } catch (err) {
      showAlertError(err)
    }
  }

  const getNotifications = async () => {
    toggleQueryLoading(dispatch)
    try {
      console.log('buscando notificacoes...')
      const notifications = [
        {
          type: 'INVITE',
          status: 'PENDING',
          createdAt: dayjs().format('lll'),
          content: 'User1 te convidou para fazer parte do grupo "familia 1"',
          seen: false,
          sender: {
            username: 'user1',
          },
          group: {
            id: 1,
          },
        },
        {
          type: 'HELP',
          createdAt: dayjs().format('lll'),
          content:
            'User1 solicitou ajuda. Você está a x km de distância. Trace uma rota utilizando o google maps: https://google.maps/route',
          seen: false,
          sender: {
            username: 'user1',
          },
          group: undefined,
        },
        {
          type: 'MESSAGE',
          createdAt: dayjs().format('lll'),
          content: 'Grupo 1 tem novas mensagens.',
          seen: false,
          sender: undefined,
          group: {
            id: 1,
          },
        },
        {
          type: 'INVITE',
          status: 'REJECTED',
          createdAt: dayjs().format('lll'),
          content: 'User1 te convidou para fazer parte do grupo "familia 1"',
          seen: true,
          sender: {
            username: 'user1',
          },
          group: {
            id: 1,
          },
        },
        {
          type: 'INVITE',
          status: 'ACCEPTED',
          createdAt: dayjs().format('lll'),
          content: 'User1 te convidou para fazer parte do grupo "familia 1"',
          seen: true,
          sender: {
            username: 'user1',
          },
          group: {
            id: 1,
          },
        },
      ]
      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: notifications,
      })
    } catch (err) {
      showAlertError(err)
    } finally {
      await new Promise((r) => setTimeout(r, 2000))
      toggleQueryLoading(dispatch)
    }
  }

  const acceptGroupInvite = async (data) => {
    toggleMutationLoading(dispatch)
    try {
      console.log('aceitando convite de grupo...', data)
      await getNotifications()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const rejectGroupInvite = async (data) => {
    toggleMutationLoading(dispatch)
    try {
      console.log('rejeitando convite de grupo...', data)
      await getNotifications()
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const markUnreadNotificationsAsRead = async () => {
    toggleMutationLoading(dispatch)
    try {
      console.log('marcando notificacoes nao lidas como lidas...')
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  return (
    <NotificationsContext.Provider
      value={{
        state,
        actions: {
          acceptGroupInvite,
          rejectGroupInvite,
          getNotifications,
          markUnreadNotificationsAsRead,
          getNonReadNotificationsAmount,
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
