import React, { useEffect, useState } from 'react'

import { Signaller } from "../../lib/signal"
import {SignalContext} from "../../contexts"

// Allow global access to our signal module through React contexts
const SignalProvider = ({url, children, token}) => {
  let [sigErr, setSigErr] = useState("")
  const signaller = new Signaller(url, (err) => setSigErr(err))

  useEffect(() => {
    signaller.connect()
    if (token) {
      signaller.setToken(token)
    }
    console.log("Signaller reset!")

  }, [url])

  return (
    <SignalContext.Provider value={{signaller, err: sigErr}}>
      {children}
    </SignalContext.Provider>
  )
}

export default SignalProvider