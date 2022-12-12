import { log } from '../../helpers/logger'

export const usersReducer = (state, action) => {
  log.debug(`[USERS] action of type ${action.type} fired`)

  switch (action.type) {
    case 'MUTATION_LOADING':
      return {
        ...state,
        mutationLoading: !state.mutationLoading,
      }
    default:
      return state
  }
}
