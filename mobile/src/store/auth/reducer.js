import { log } from '../../helpers/logger'

export const userAuthReducer = (state, action) => {
  log.debug(`[AUTH] action of type ${action.type} fired`)

  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        session: action.payload,
      }
    case 'LOGOUT':
      return {
        session: undefined,
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
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: { ...state.session, ...action.payload },
      }
    default:
      return state
  }
}
