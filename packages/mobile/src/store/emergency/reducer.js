import { log } from '@pfg2/logger'

export const emergencyReducer = (state, action) => {
  log.debug(`[EMERGENCY] action of type ${action.type} fired`)

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
