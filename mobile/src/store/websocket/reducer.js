import { log } from '../../helpers/logger'

export const webSocketReducer = (state, action) => {
  log.debug(`[WEBSOCKET] action of type ${action.type} fired`)

  switch (action.type) {
    case 'CONNECT':
      return action.payload
    case 'DISCONNECT':
      return null
    default:
      return state
  }
}
