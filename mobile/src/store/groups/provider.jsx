import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { handleSocketResponse } from '../../helpers/feedback/handleSocketResponse'
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
    actions: {
      emitEventJoinGroup,
      emitEventLeaveGroup,
      emitEventCreateGroup,
      emitEventAddMembersToGroup,
    },
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

  const createGroup = (payload, toast, actions) => {
    toggleMutationLoading(dispatch)
    emitEventCreateGroup(
      {
        ...payload,
        user: { id: session.id, username: session.username },
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          actions()
          dispatch({ type: 'CREATE_GROUP', payload: response.data })
        })
      }
    )
  }

  const addMembersToGroup = (payload, toast, actions) => {
    toggleMutationLoading(dispatch)
    emitEventAddMembersToGroup(
      {
        ...payload,
        user: { id: session.id, username: session.username },
      },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, actions)
      }
    )
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

  const shareLocationWithAllGroups = async () => {
    try {
      toggleMutationLoading(dispatch)
      await api.patch('/groups/share-location-with-all')
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const onGroupInviteAccepted = (payload) => {
    dispatch({
      type: 'ON_GROUP_INVITE_ACCEPTED',
      payload,
    })
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
          addMembersToGroup,
          onGroupInviteAccepted,
        },
      }}
    >
      {children}
    </UserGroupContext.Provider>
  )
}
