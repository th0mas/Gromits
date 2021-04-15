import React, { useContext, useEffect, useState } from 'react'

import { Signaller } from "../../lib/signal"
import {SignalContext, TokenContext} from "../../contexts"

// Allow global access to our signal module through React contexts
const SignalProvider = ({url, children}) => {
  let [sigErr, setSigErr] = useState("")
  let [token, setToken] = useContext(TokenContext)
  const signaller = new Signaller(url, (err) => setSigErr(err))

  const authError = () => {
    console.log("Clearing token")
    setToken("")
  }

  signaller.setAuthErrCallback(authError)

  useEffect(() => {
    if (token) {
      signaller.setToken(token)
      signaller.connect()
    } else {
      signaller.disconnect()
    }
    
    console.log("Signaller reset!")

  }, [url, token])

  return (
    <SignalContext.Provider value={{signaller, err: sigErr}}>
      {children}
    </SignalContext.Provider>
  )
}

export default SignalProvider