export const userLocationReducer = (state, action) => {
  console.log(`[LOCATION] action of type ${action.type} fired`)

  switch (action.type) {
    case 'ERROR':
      return {
        ...state,
        error: action.payload ?? 'something went wrong',
      }
    default:
      return state
  }
}
