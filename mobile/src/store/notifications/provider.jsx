import { createContext, useContext, useEffect, useReducer } from 'react'
import { PER_PAGE } from '../../constants'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { handleSocketResponse } from '../../helpers/feedback/handleSocketResponse'
import { log } from '../../helpers/logger'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useUserGroup } from '../groups/provider'
import { useUserLocation } from '../location/provider'
import { useWebSocket } from '../websocket/provider'
import { notificationsReducer } from './reducer'

const notificationsInitialState = {
  mutationLoading: false,
  queryLoading: false,
  notifications: [],
  non_read_notifications_amount: null,
  page: 1,
  paginationLoading: false,
  total: 0,
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
  const {
    actions: { onGroupInviteAccepted },
  } = useUserGroup()
  const {
    actions: { getCurrentPosition, updateEmergencyMarkers },
  } = useUserLocation()

  useEffect(() => {
    getNotifications()
  }, [])

  const togglePaginationLoading = () => {
    dispatch({
      type: 'PAGINATION_LOADING',
    })
  }

  const getNotifications = async (page = state.page) => {
    if (Math.ceil(state.total / PER_PAGE) >= page || page === 1) {
      try {
        page === 1 ? toggleQueryLoading(dispatch) : togglePaginationLoading()
        const { data } = await api.get(`/notifications`, {
          params: { page: page },
        })
        dispatch({
          type: 'APPEND_NOTIFICATIONS',
          payload: { ...data, nextPage: page + 1 },
        })
      } catch (err) {
        showAlertError(err)
      } finally {
        page === 1 ? toggleQueryLoading(dispatch) : togglePaginationLoading()
      }
    } else {
      log.info(`[${session.username}] There is no more notifications to fetch`)
    }
  }

  const updateNotifications = (notifications) => {
    dispatch({
      type: 'UPDATE_NOTIFICATIONS',
      payload: notifications,
    })
  }

  const markUnreadNotificationsAsRead = async () => {
    const unseenNotifications = state.notifications.filter((n) => !n.seen)
    log.debug(
      `[${session.username}] ${unseenNotifications.length} unseen notifications ${unseenNotifications}`
    )
    if (unseenNotifications.length) {
      try {
        toggleMutationLoading(dispatch)
        await api.patch('/notifications/unread-to-read', {
          notificationsIds: unseenNotifications.map((n) => n.id),
        })
        updateNotifications(
          unseenNotifications.map((n) => ({ ...n, seen: true }))
        )
        log.info(
          `[${
            session.username
          }] marked notifications: ${unseenNotifications.map(
            (n) => n.id
          )} as read`
        )
      } catch (err) {
        showAlertError(err)
      } finally {
        toggleMutationLoading(dispatch)
      }
    } else {
      log.info(`[${session.username}] no unread notifications`)
    }
  }

  const acceptGroupInvite = (notificationId, groupId, toast) => {
    toggleMutationLoading(dispatch)
    emitEventAcceptGroupInvite(
      {
        notificationId,
        groupId,
        userId: session.id,
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          updateNotifications([
            {
              ...state.notifications.find((n) => n.id === notificationId),
              seen: true,
              status: 'ACCEPTED',
            },
          ])
          onGroupInviteAccepted(response.data)
        })
      }
    )
  }

  const rejectGroupInvite = (notificationId, toast) => {
    toggleMutationLoading(dispatch)
    emitEventRejectGroupInvite(notificationId, (response) => {
      toggleMutationLoading(dispatch)
      handleSocketResponse(response, toast, () => {
        updateNotifications([
          {
            ...state.notifications.find((n) => n.id === notificationId),
            seen: true,
            status: 'REJECTED',
          },
        ])
      })
    })
  }

  const askHelp = async (toast) => {
    toggleMutationLoading(dispatch)
    emitEventAskHelp(
      {
        user: { id: session.id, username: session.username },
        position: await getCurrentPosition(),
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          updateEmergencyMarkers(response.emergencyLocation)
        })
      }
    )
  }

  const onNotificationReceived = ({ notification, emergencyLocation }) => {
    if (notification.type === 'HELP') {
      updateEmergencyMarkers(emergencyLocation)
    }
    dispatch({ type: 'ON_NOTIFICATION_RECEIVED', payload: notification })
  }

  return (
    <NotificationsContext.Provider
      value={{
        state,
        actions: {
          getNotifications,
          markUnreadNotificationsAsRead,
          acceptGroupInvite,
          rejectGroupInvite,
          askHelp,
          onNotificationReceived,
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
