import React, { useEffect, useState } from 'react'

import { Signaller } from "../../lib/signal"
import {SignalContext} from "../../contexts"

// Allow global access to our signal module through React contexts
const SignalProvider = ({url, children}) => {
  let [sigErr, setSigErr] = useState("")

  const signaller = new Signaller(url, (err) => setSigErr(err))
  useEffect(() => signaller.connect(), [url])

  return (
    <SignalContext.Provider value={{signaller, err: sigErr}}>
      {children}
    </SignalContext.Provider>
  )
}

export default SignalProvider