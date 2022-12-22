import { log } from '../../helpers/logger'

export const userGroupsReducer = (state, action) => {
  log.debug(`[GROUPS] action of type ${action.type} fired`)

  switch (action.type) {
    case 'GET_GROUPS':
      return {
        ...state,
        groups: action.payload.groups,
        groupsThatOwn: action.payload.groupsThatOwn,
        groupsThatLocationIsShared: action.payload.groupsThatLocationIsShared,
      }
    case 'UPDATE_CURRENT_GROUP':
      return {
        ...state,
        current: action.payload,
      }
    case 'RECEIVE_CHAT_MESSAGE':
      const message = action.payload
      const alreadyIn = state.current.messages.find((m) => m.id === message.id)
      if (alreadyIn) return state
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
    case 'CREATE_GROUP':
      return {
        ...state,
        groups: [...state.groups, action.payload.groupWithMembersAndMessages],
        groupsThatOwn: [...state.groupsThatOwn, action.payload.group],
        groupsThatLocationIsShared: [
          ...state.groupsThatLocationIsShared,
          action.payload.group,
        ],
      }
    case 'ON_GROUP_INVITE_ACCEPTED':
      return {
        ...state,
        groups: [...state.groups, action.payload.groupWithMembersAndMessages],
        groupsThatLocationIsShared: [
          ...state.groupsThatLocationIsShared,
          action.payload.group,
        ],
      }
    case 'SHARE_LOCATION_WITH_ALL_GROUPS':
      return {
        ...state,
        groupsThatLocationIsShared: state.groups,
      }
    case 'DISCONNECT_USER_FROM_LOCATION_SHARING':
      return {
        ...state,
        groupsThatLocationIsShared: state.groupsThatLocationIsShared.filter(
          (g) => g.id !== action.payload.groupId
        ),
      }
    case 'CONNECT_USER_FROM_LOCATION_SHARING':
      return {
        ...state,
        groupsThatLocationIsShared: [
          ...state.groupsThatLocationIsShared,
          state.groups.find((g) => g.id === action.payload.groupId),
        ],
      }
    case 'ON_REMOVE_MEMBER':
      return {
        ...state,
        groups: state.groups.map((g) => {
          return g.id === action.payload.groupId
            ? {
                ...g,
                members: g.members.filter(
                  (m) => m.id !== action.payload.userId
                ),
              }
            : g
        }),
      }
    case 'ON_REMOVED_FROM_GROUP':
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== action.payload.groupId),
        groupsThatLocationIsShared: state.groupsThatLocationIsShared.filter(
          (g) => g.id !== action.payload.groupId
        ),
      }
    case 'ON_REMOVE_GROUP':
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== action.payload.groupId),
        groupsThatLocationIsShared: state.groupsThatLocationIsShared.filter(
          (g) => g.id !== action.payload.groupId
        ),
        groupsThatOwn: state.groupsThatOwn.filter(
          (g) => g.id !== action.payload.groupId
        ),
      }
    default:
      return state
  }
}
