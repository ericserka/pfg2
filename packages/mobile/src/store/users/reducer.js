import { log } from '@pfg2/logger'

export const usersReducer = (state, action) => {
  log.debug(`[UsersReducer]: Received action of type ${action.type}`)
  switch (action.type) {
    case 'SET_USERS':
      return {
        users: action.payload,
      }
    default:
      return state
  }
}
