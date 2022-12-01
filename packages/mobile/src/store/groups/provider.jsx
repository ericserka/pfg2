import { createContext, useContext, useEffect, useReducer } from 'react'
import { showAlertError } from '../../helpers/actions/showAlertError'
import { toggleQueryLoading } from '../../helpers/actions/toggleQueryLoading'
import { api } from '../../services/api/axios'
import { useUserAuth } from '../auth/provider'
import { useWebSocket } from '../websocket/provider'
import { userGroupsReducer } from './reducer'

const userGroupInitialState = {
  groups: undefined,
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
    actions: { emitEventJoinGroup },
  } = useWebSocket()

  useEffect(() => {
    getGroups()
  }, [])

  const getGroups = async () => {
    toggleQueryLoading(dispatch)
    try {
      const { data } = await api.get('/groups/me')

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
          groupsWithoutCurrentUser[0].id,
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
    dispatch({
      type: 'UPDATE_CURRENT_GROUP',
      payload: (groups ?? state.groups).find((group) => group.id === id),
    })
    emitEventJoinGroup(session.id, id)
  }

  const updateCurrentGroup = (data) => {
    dispatch({
      type: 'UPDATE_CURRENT_GROUP',
      payload: { ...state.current, ...data },
    })
  }

  return (
    <UserGroupContext.Provider
      value={{
        state,
        actions: {
          getGroups,
          changeSelectedGroup,
          updateCurrentGroup,
        },
      }}
    >
      {children}
    </UserGroupContext.Provider>
  )
}
