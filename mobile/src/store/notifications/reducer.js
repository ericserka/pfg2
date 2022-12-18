import { dayjs } from '../../helpers/dayjs'
import { log } from '../../helpers/logger'

export const notificationsReducer = (state, action) => {
  log.debug(`[NOTIFICATIONS] action of type ${action.type} fired`)

  switch (action.type) {
    case 'QUERY_LOADING':
      return {
        ...state,
        queryLoading: !state.queryLoading,
      }
    case 'PAGINATION_LOADING':
      return {
        ...state,
        paginationLoading: !state.paginationLoading,
      }
    case 'MUTATION_LOADING':
      return {
        ...state,
        mutationLoading: !state.mutationLoading,
      }
    case 'APPEND_NOTIFICATIONS':
      const notifications =
        action.payload.nextPage === 2
          ? action.payload.notifications
          : [...state.notifications, ...action.payload.notifications]
      return {
        ...state,
        notifications,
        non_read_notifications_amount:
          action.payload.non_read_notifications_amount ??
          state.non_read_notifications_amount,
        page: action.payload.nextPage,
        total: action.payload?.total ?? state.total,
      }
    case 'UPDATE_NOTIFICATIONS': {
      const notifications = Object.values(
        [...state.notifications, ...action.payload].reduce(
          (acc, n) => ({
            ...acc,
            [n.id]: n,
          }),
          {}
        )
      ).sort((a, b) => dayjs(a.createdAt).isBefore(b.createdAt))
      return {
        ...state,
        notifications,
        non_read_notifications_amount: notifications.filter((n) => !n.seen)
          .length,
      }
    }
    case 'ON_NOTIFICATION_RECEIVED':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        non_read_notifications_amount: state.non_read_notifications_amount + 1,
        page: 1,
      }
    default:
      return state
  }
}
