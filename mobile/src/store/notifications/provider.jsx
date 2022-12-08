import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { countKeyValueFromArrOfObjs } from '../../helpers/snippets'
import { api } from '../../services/api/axios'
import { notificationsReducer } from './reducer'

const notificationsInitialState = {
  mutationLoading: false,
  queryLoading: false,
  notifications: [],
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

  useEffect(() => {
    getNotifications()
  }, [])

  useEffect(() => {
    dispatch({
      type: 'SET_NON_READ_NOTIFICATIONS_AMOUNT',
      payload:
        countKeyValueFromArrOfObjs(state.notifications, 'seen')?.false ?? null,
    })
  }, [state.notifications])

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
    dispatch({
      type: 'UPDATE_NOTIFICATION',
      payload: notification,
    })
  }

  const markUnreadNotificationsAsRead = async () => {
    toggleMutationLoading(dispatch)
    try {
      await api.patch('/notifications/unread-to-read', {
        notificationsIds: state.notifications.map((n) => n.id),
      })
      getNotifications()
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
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
