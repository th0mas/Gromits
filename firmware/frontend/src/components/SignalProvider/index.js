import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Signaller } from "../../lib/signal"
import {SignalContext, TokenContext} from "../../contexts"

// Allow global access to our signal module through React contexts
const SignalProvider = ({url, children}) => {
  let [sigErr, setSigErr] = useState("")
  let [token, setToken] = useContext(TokenContext)
  let [signaller, setSignaller] = useState()

  const authError = useCallback(() => {
    console.log("Clearing token")
    setToken("INVALID")
  }, [setToken])

  const initializeSignaller = useCallback(() => {
    if (!signaller) {
      const s = new Signaller(url, (err) => setSigErr(err))
      s.setAuthErrCallback(authError)
      s.setSetTokenCallback(setToken) 
      setSignaller(s)
    }
  }, [url, signaller, setToken, authError])


  useEffect(() => {
    initializeSignaller()

    if (token && signaller) {
      signaller.disconnect().then(() => {
        signaller.setToken(token)
        signaller.connect()
      })
      
    }
  },
    [initializeSignaller, token, signaller]) 

  return (
    <SignalContext.Provider value={{signaller, err: sigErr}}>
      {children}
    </SignalContext.Provider>
  )
}

export default SignalProvider