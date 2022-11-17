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
    case 'LOGOUT':
      return {
        session: undefined,
        error: undefined,
      }
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
    default:
      return state
  }
}
