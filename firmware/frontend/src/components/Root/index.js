import React from 'react'
import Stream from '../Stream'
import SignalProvider from "../SignalProvider";
import SmartData from '../SmartData/index.js'

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"

const Root = () => {
  return <>
    <SignalProvider url={signalServerPath + "/signaller"}>
      <Stream />
    </SignalProvider>
    <SmartData />
  </>
}

export default Root
