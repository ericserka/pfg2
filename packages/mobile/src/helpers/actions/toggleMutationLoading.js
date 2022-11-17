// use this in the providers files to start or stop a mutation (POST, PATCH, DELETE) loading
export const toggleMutationLoading = (dispatch) => {
  dispatch({
    type: 'MUTATION_LOADING',
  })
}
