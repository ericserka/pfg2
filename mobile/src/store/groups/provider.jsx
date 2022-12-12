import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'
import { userGroupsReducer } from './reducer'

const userGroupInitialState = {
  groups: undefined,
  groupsThatOwn: undefined,
  groupsThatLocationIsShared: undefined,
  current: undefined,
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
  }, [])

  const getGroups = async () => {
    toggleQueryLoading(dispatch)
    try {
      const {
        data: { groups, groupsThatOwn, groupsThatLocationIsShared },
      } = await api.get('/groups/me')
      const lastGroupSelectedId = session?.defaultGroupId

      const groupsWithoutCurrentUser = groups.map((group) => ({
        ...group,
        members: group.members.filter((m) => m.id !== session.id),
      }))

      dispatch({
        type: 'GET_GROUPS',
        payload: {
          groups: groupsWithoutCurrentUser,
          groupsThatOwn,
          groupsThatLocationIsShared,
        },
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

  const alterGroupLocationSharing = async (groupId, connect) => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/groups/alter-group-location-sharing', {
        groupId,
        connect,
      })
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const shareLocationWithAllGroups = async (groupId, connect) => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/groups/share-location-with-all')
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
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
          alterGroupLocationSharing,
          shareLocationWithAllGroups,
        },
      }}
    >
      {children}
    </UserGroupContext.Provider>
  )
}
