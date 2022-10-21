export const helloReducer = (state, action) => {
  switch (action.type) {
    case 'NEW_MESSAGE':
      return {
        messages: [action.payload, ...state.messages],
      }
    default:
      return state
  }
}
