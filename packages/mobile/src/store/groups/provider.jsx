import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'
import { userGroupsReducer } from './reducer'
import {
  storeLastGroupSelectedLocal,
  fetchLastGroupIdLocal,
} from '../../services/local-storage'
import { log } from '@pfg2/logger'

const userGroupInitialState = {
  groups: undefined,
  current: undefined,
  userGroupsAmount: 0,
  queryLoading: false,
  mutationLoading: false,
}

const UserGroupContext = createContext({
  state: { ...userGroupInitialState },
})

export const useUserGroup = () => useContext(UserGroupContext)

export const UserGroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userGroupsReducer, userGroupInitialState)
  const {
    state: { session },
  } = useUserAuth()
  const {
    actions: { emitEventJoinGroup, emitEventLeaveGroup },
  } = useWebSocket()

  useEffect(() => {
    getGroups()
    getUserGroupsAmount()

    return () => {
      storeLastGroupSelectedLocal(state.current?.id)
    }
  }, [])

  const getGroups = async () => {
    toggleQueryLoading(dispatch)
    try {
      const { data } = await api.get('/groups/me')
      const lastGroupSelectedId = await fetchLastGroupIdLocal()

      const groupsWithoutCurrentUser = data.map((group) => ({
        ...group,
        members: group.members.filter((m) => m.id !== session.id),
      }))

      dispatch({
        type: 'GET_GROUPS',
        payload: groupsWithoutCurrentUser,
      })

      if (groupsWithoutCurrentUser.length) {
        changeSelectedGroup(
          lastGroupSelectedId
            ? lastGroupSelectedId
            : groupsWithoutCurrentUser[0].id,
          groupsWithoutCurrentUser
        )
      }
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleQueryLoading(dispatch)
    }
  }

  const changeSelectedGroup = (id, groups = undefined) => {
    if (state.current) emitEventLeaveGroup(session.id, state.current.id)
    dispatch({
      type: 'UPDATE_CURRENT_GROUP',
      payload: (groups ?? state.groups).find((group) => group.id === id),
    })
    emitEventJoinGroup(session.id, id)
  }

  const createGroup = async (name, members) => {
    const { data } = await api.post('/groups', {
      name,
      membersToInviteIds: members,
    })
    const groups = [...state.groups, data]
    dispatch({
      type: 'GET_GROUPS',
      payload: groups,
    })
    changeSelectedGroup(data.id, groups)
  }

  const receiveChatMessage = (message) => {
    dispatch({
      type: 'RECEIVE_CHAT_MESSAGE',
      payload: message,
    })
  }

  const receiveLocationUpdate = (location) => {
    dispatch({
      type: 'RECEIVE_LOCATION_UPDATE',
      payload: location,
    })
  }

  const getUserGroupsAmount = async () => {
    try {
      const { data } = await api.get(`/users/groups-amount`)
      dispatch({
        type: 'SET_USER_GROUPS_AMOUNT',
        payload: data.count,
      })
    } catch (err) {
      showAlertError(err)
    }
  }

  return (
    <UserGroupContext.Provider
      value={{
        state,
        actions: {
          getGroups,
          changeSelectedGroup,
          createGroup,
          receiveChatMessage,
          receiveLocationUpdate,
        },
      }}
    >
      {children}
    </UserGroupContext.Provider>
  )
}
