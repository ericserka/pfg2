import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { countKeyValueFromArrOfObjs } from '../../helpers/snippets'
import { api } from '../../services/api/axios'
import { notificationsReducer } from './reducer'
import { handleSocketResponse } from '../../helpers/feedback/handleSocketResponse'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'

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
  const {
    state: { session },
  } = useUserAuth()
  const {
    actions: {
      emitEventAcceptGroupInvite,
      emitEventRejectGroupInvite,
      emitEventAskHelp,
    },
  } = useWebSocket()

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

  const acceptGroupInvite = (notificationId, groupId, toast) => {
    toggleMutationLoading(dispatch)
    emitEventAcceptGroupInvite(
      {
        notificationId: notificationId,
        groupId: groupId,
        userId: session.id,
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          updateNotification({
            id: notificationId,
            seen: true,
            status: 'ACCEPTED',
          })
        })
      }
    )
  }

  const rejectGroupInvite = (notificationId, toast) => {
    toggleMutationLoading(dispatch)
    emitEventRejectGroupInvite(notificationId, (response) => {
      toggleMutationLoading(dispatch)
      handleSocketResponse(response, toast, () => {
        updateNotification({
          id: notificationId,
          seen: true,
          status: 'REJECTED',
        })
      })
    })
  }

  const askHelp = (toast) => {
    toggleMutationLoading(dispatch)
    emitEventAskHelp(
      {
        user: { id: session.id, username: session.username },
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast)
      }
    )
  }

  return (
    <NotificationsContext.Provider
      value={{
        state,
        actions: {
          updateNotification,
          getNotifications,
          markUnreadNotificationsAsRead,
          acceptGroupInvite,
          rejectGroupInvite,
          askHelp,
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
