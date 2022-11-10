export const helloReducer = (state, action) => {
  console.log(`[HelloReducer]: Received action of type ${action.type}`)

  switch (action.type) {
    case 'NEW_MESSAGE':
      return {
        messages: [action.payload, ...state.messages],
      }
    default:
      return state
  }
}
