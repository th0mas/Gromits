import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import Stream from '../Stream'
import SignalProvider from "../SignalProvider";
import SmartData from '../SmartData/index.js'
import Admin from "../Admin";
import TokenProvider from "../TokenProvider";

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY

const Root = () => {
  return <>
      <TokenProvider>
      <Router>
      <Switch>
        <Route path="/admin"><Admin /></Route>
        <SignalProvider url={signalServerPath + "/signaller"}>
          <Route path="/"><Stream /></Route>
        </SignalProvider>
      </Switch>
      </Router>
      </TokenProvider>
    {/* <SmartData api={apiKey}/> */}
  </>
}

export default Root
