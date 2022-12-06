import { log } from '../../helpers/logger'

export const webSocketReducer = (state, action) => {
  log.debug(`[WEBSOCKET] action of type ${action.type} fired`)

  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        socket: action.payload,
        connecting: false,
      }
    case 'DISCONNECT':
      return {
        ...state,
        socket: undefined,
      }
    default:
      return state
  }
}
