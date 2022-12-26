import { log } from '../../helpers/logger'

export const userLocationReducer = (state, action) => {
  log.debug(`[LOCATION] action of type ${action.type} fired`)

  switch (action.type) {
    case 'SET_MARKERS':
      return {
        ...state,
        markers: action.payload,
      }
    case 'UPDATE_MARKERS':
      return {
        ...state,
        markers: [...state.markers, action.payload],
      }
    case 'ERROR':
      return {
        ...state,
        error: action.payload ?? 'something went wrong',
      }
    default:
      return state
  }
}
