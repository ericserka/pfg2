export const userAuthReducer = (state, action) => {
  // substituir por um um modulo "logger"seria interessante (pino)
  console.log(`[AUTH] action of type ${action.type} fired`)

  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        session: action.payload,
        error: undefined,
        loading: false,
      }
    case 'ERROR':
      return {
        ...state,
        session: undefined,
        error: action.payload ?? 'something went wrong',
        loading: false,
      }
    case 'LOGOUT':
      return {
        session: undefined,
        error: undefined,
        loading: false,
      }
    default:
      return state
  }
}
