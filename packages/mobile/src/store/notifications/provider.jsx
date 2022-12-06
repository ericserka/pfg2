import dayjs from '@pfg2/dayjs'
import { log } from '@pfg2/logger'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { api } from '../../services/api/axios'
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
      const { data } = await api.get(`/notifications`)
      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: data,
      })
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleQueryLoading(dispatch)
    }
  }

  const updateNotification = (notification) => {
    log.debug('updateNotification', notification)
    dispatch({
      type: 'UPDATE_NOTIFICATION',
      payload: notification,
    })
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
          updateNotification,
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
