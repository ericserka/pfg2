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
    case 'RECEIVE_CHAT_MESSAGE': {
      const current = {
        ...state.current,
        messages: [...state.current.messages, action.payload],
      }
      return {
        ...state,
        current,
        groups: state.groups.map((g) => (g.id === current.id ? current : g)),
      }
    }
    case 'RECEIVE_LOCATION_UPDATE': {
      if (!state.current) return state

      const current = {
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
      }

      return {
        ...state,
        current,
        groups: state.groups.map((g) => (g.id === current.id ? current : g)),
      }
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
    case 'ON_REMOVE_MEMBER': {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId
      )
      if (!group) return state

      const current =
        state.current?.id === action.payload.groupId
          ? {
              ...state.current,
              members: state.current.members.filter(
                (m) => m.id !== action.payload.userId
              ),
            }
          : state.current
      return {
        ...state,
        current,
        groups: state.groups.map((g) => (g.id === current.id ? current : g)),
      }
    }
    case 'ON_ADD_MEMBER': {
      const current =
        state.current?.id === action.payload.groupId
          ? {
              ...state.current,
              members: [...state.current.members, action.payload.user],
            }
          : state.current
      return {
        ...state,
        current,
        groups: state.groups.map((g) => (g.id === current.id ? current : g)),
      }
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
