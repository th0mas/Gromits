import { createContext, useContext, useReducer, useEffect } from 'react'

const SignalContext = createContext()

const useSignaller = (reducer, initialState) => {
  const client = useContext(SignalContext)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const callback = (msg) => dispatch(msg)

    client.signaller.registerRTCCallback(callback)

    return () => {
      client.signaller.removeRTCCallback(callback)
    }
  })
  
  return {state, ...client.err}
}

export {SignalContext, useSignaller}