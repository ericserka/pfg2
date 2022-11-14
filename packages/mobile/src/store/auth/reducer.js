import { log } from '@pfg2/logger'

export const userAuthReducer = (state, action) => {
  log.debug(`[AUTH] action of type ${action.type} fired`)

  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        session: action.payload,
        error: undefined,
      }
    case 'ERROR':
      return {
        ...state,
        session: undefined,
        error: action.payload ?? 'something went wrong',
      }
    case 'LOGOUT':
      return {
        session: undefined,
        error: undefined,
      }
    default:
      return state
  }
}
