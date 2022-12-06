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
    case 'RECEIVE_CHAT_MESSAGE':
      return {
        ...state,
        current: {
          ...state.current,
          messages: [...state.current.messages, action.payload],
        },
      }
    case 'RECEIVE_LOCATION_UPDATE':
      if (!state.current) return state
      return {
        ...state,
        current: {
          ...state.current,
          members: state.current.members.map((m) =>
            m.id === action.payload.userId
              ? {
                  ...m,
                  position: {
                    lat: action.payload.position.latitude,
                    lng: action.payload.position.longitude,
                  },
                  lastKnownLocationUpdatedAt: action.payload.timestamp,
                }
              : m
          ),
        },
      }
    case 'SET_USER_GROUPS_AMOUNT':
      return {
        ...state,
        userGroupsAmount: action.payload,
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
