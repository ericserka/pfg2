import { log } from '@pfg2/logger'

export const notificationsReducer = (state, action) => {
  log.debug(`[NOTIFICATIONS] action of type ${action.type} fired`)

  switch (action.type) {
    case 'QUERY_LOADING':
      return {
        ...state,
        queryLoading: !state.queryLoading,
      }
    case 'MUTATION_LOADING':
      return {
        ...state,
        mutationLoading: !state.mutationLoading,
      }
    case 'GET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      }
    case 'SET_NON_READ_NOTIFICATIONS_AMOUNT':
      return {
        ...state,
        non_read_notifications_amount: action.payload,
      }
    default:
      return state
  }
}
