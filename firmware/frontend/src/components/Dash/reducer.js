export const initialState = {
  data: {},
  error: false,
  isLoading: true
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'loaded':
      return {data: action.data, isLoading: false, error: false}
    case 'error':
      return {isLoading: false, error: action.error}
    default:
      return state
  }
}