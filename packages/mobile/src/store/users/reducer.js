export const usersReducer = (state, action) => {
  console.log(`[UsersReducer]: Received action of type ${action.type}`)
  switch (action.type) {
    case 'SET_USERS':
      return {
        users: action.payload,
      }
    default:
      return state
  }
}
