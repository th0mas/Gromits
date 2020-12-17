import React from 'react'
import Stream from '../Stream'
import SignalProvider from "../SignalProvider";

const signalServerPath = process.env.NODE_ENV === "production" ? "https://gromit.tomh.uk" : "http://localhost:8080"

const Root = () => {
  return (
    <SignalProvider url={signalServerPath + "/signaller"}>
      <Stream />
    </SignalProvider>
  )
}

export default Root