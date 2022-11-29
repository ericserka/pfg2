import { log } from '@pfg2/logger'

export const userGroupsReducer = (state, action) => {
  log.debug(`[GROUPS] action of type ${action.type} fired`)

  switch (action.type) {
    case 'GET_GROUPS':
      return {
        ...state,
        groups: action.payload,
      }
    case 'UPDATE_CURRENT_GROUP':
      return {
        ...state,
        current: action.payload,
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
