import React from 'react'
import Stream from '../Stream'
import SignalProvider from "../SignalProvider";
import SmartData from '../SmartData/index.js'

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"
const apiKey = process.env.OPENWEATHER_API_KEY

const Root = () => {
  return <>
    <SignalProvider url={signalServerPath + "/signaller"}>
      <Stream />
    </SignalProvider>
    <SmartData api={apiKey}/>
  </>
}

export default Root
