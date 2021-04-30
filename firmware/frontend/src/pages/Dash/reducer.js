export const initialState = {
  data: {},
  error: false,
  isLoading: true,
  peer: null,
  active: false
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'loaded':
      return {data: action.data, isLoading: false, error: false}
    case 'error':
      return {isLoading: false, error: action.error}
    case 'set-client':
      return {peer: action.data, active: true, ...state}
    default:
      return state
  }
}