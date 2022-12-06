// use this in the providers files to start or stop a query (GET) loading
export const toggleQueryLoading = (dispatch) => {
  dispatch({
    type: 'QUERY_LOADING',
  })
}
