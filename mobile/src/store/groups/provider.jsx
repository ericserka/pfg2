import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleMutationLoading } from '../../helpers/actions/toggleMutationLoading'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { handleSocketResponse } from '../../helpers/feedback/handleSocketResponse'
import { log } from '../../helpers/logger'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'
import { userGroupsReducer } from './reducer'

const userGroupInitialState = {
  groups: [],
  groupsThatOwn: [],
  groupsThatLocationIsShared: [],
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
    actions: { updateSession },
  } = useUserAuth()
  const {
    actions: {
      emitEventJoinGroup,
      emitEventLeaveChat,
      emitEventCreateGroup,
      emitEventAddMembersToGroup,
      emitEventRemoveGroupMember,
      emitEventDeleteGroup,
      emitEventLeaveGroup,
      listenToUserJoinedGroup,
      unlistenToUserJoinedGroup,
      listenToUserLeftGroup,
      unlistenToUserLeftGroup,
    },
  } = useWebSocket()

  useEffect(() => {
    getGroups()
  }, [])

  useEffect(() => {
    listenToUserJoinedGroup(({ user, groupId }) => {
      log.info(
        `[${session.username}] User ${user.username} joined group ${groupId}`
      )
      dispatch({
        type: 'ON_ADD_MEMBER',
        payload: {
          user,
          groupId,
        },
      })
    })

    listenToUserLeftGroup(({ userId, groupId }) => {
      log.debug(`[${session.username}] User ${userId} left group ${groupId}`)
      dispatch({
        type: 'ON_REMOVE_MEMBER',
        payload: {
          userId,
          groupId,
        },
      })
    })

    return () => {
      unlistenToUserJoinedGroup()
      unlistenToUserLeftGroup()
    }
  }, [])

  const getGroups = async () => {
    toggleQueryLoading(dispatch)
    try {
      const {
        data: { groups, groupsThatOwn, groupsThatLocationIsShared },
      } = await api.get('/groups/me')
      const lastGroupSelectedId = session?.defaultGroupId

      dispatch({
        type: 'GET_GROUPS',
        payload: {
          groups,
          groupsThatOwn,
          groupsThatLocationIsShared,
        },
      })

      if (groups.length) {
        changeSelectedGroup(
          lastGroupSelectedId ? lastGroupSelectedId : groups[0].id,
          groups
        )
      }
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleQueryLoading(dispatch)
    }
  }

  const changeSelectedGroup = (id, groups = undefined) => {
    if (state.current) emitEventLeaveChat(session.id, state.current.id)
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
          if (!state.groups.length) {
            updateSession({ defaultGroupId: response.data.group.id })
            changeSelectedGroup(response.data.group.id, [
              response.data.groupWithMembersAndMessages,
            ])
          }
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
      dispatch({
        type: connect
          ? 'CONNECT_USER_FROM_LOCATION_SHARING'
          : 'DISCONNECT_USER_FROM_LOCATION_SHARING',
        payload: { groupId },
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
      dispatch({ type: 'SHARE_LOCATION_WITH_ALL_GROUPS' })
    } catch (err) {
      showAlertError(err)
    } finally {
      toggleMutationLoading(dispatch)
    }
  }

  const onGroupInviteAccepted = (payload) => {
    if (!state.groups.length) {
      updateSession({ defaultGroupId: payload.group.id })
      changeSelectedGroup(payload.group.id, [
        payload.groupWithMembersAndMessages,
      ])
    }
    dispatch({
      type: 'ON_GROUP_INVITE_ACCEPTED',
      payload,
    })
  }

  const removeUserFromGroup = (payload, toast, onSuccess) => {
    toggleMutationLoading(dispatch)
    emitEventRemoveGroupMember(
      { ...payload, owner: { id: session.id, username: session.username } },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          dispatch({
            type: 'ON_REMOVE_MEMBER',
            payload: { groupId: payload.group.id, userId: payload.userId },
          })
          onSuccess()
        })
      }
    )
  }

  const removeGroup = (payload, toast, onSuccess) => {
    toggleMutationLoading(dispatch)
    emitEventDeleteGroup(
      { ...payload, user: { id: session.id, username: session.username } },
      (response) => {
        toggleMutationLoading(dispatch)
        handleSocketResponse(response, toast, () => {
          onSuccess()
          dispatch({
            type: 'ON_REMOVE_GROUP',
            payload: { groupId: payload.group.id },
          })
        })
      }
    )
  }

  const leaveGroup = (groupId, toast, onSuccess) => {
    toggleMutationLoading(dispatch)
    emitEventLeaveGroup({ groupId, userId: session.id }, (response) => {
      toggleMutationLoading(dispatch)
      handleSocketResponse(response, toast, () => {
        onSuccess()
        dispatch({ type: 'ON_REMOVED_FROM_GROUP', payload: { groupId } })
      })
    })
  }

  const onRemovedFromGroup = (payload) => {
    removeCurrentAndUpdateToFirstGroupIfPossible(payload.groupId)
    dispatch({ type: 'ON_REMOVED_FROM_GROUP', payload })
  }

  const removeCurrentAndUpdateToFirstGroupIfPossible = (groupId) => {
    if (state.current?.id === groupId) {
      const newGroups = state.groups.filter((g) => g.id !== groupId)
      newGroups.length
        ? changeSelectedGroup(newGroups[0].id, newGroups)
        : dispatch({
            type: 'UPDATE_CURRENT_GROUP',
            payload: undefined,
          })
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
          addMembersToGroup,
          onGroupInviteAccepted,
          removeUserFromGroup,
          removeGroup,
          leaveGroup,
          onRemovedFromGroup,
          removeCurrentAndUpdateToFirstGroupIfPossible,
        },
      }}
    >
      {children}
    </UserGroupContext.Provider>
  )
}
