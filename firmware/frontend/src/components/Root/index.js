import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import Stream from '../Stream'
import Setup from '../Setup'
import SignalProvider from "../SignalProvider";
import SmartData from '../SmartData/index.js'
import Admin from "../Admin";

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY

const Root = () => {
  return <>
    <SignalProvider url={signalServerPath + "/signaller"}>
      <Router>
      <Switch>
        <Route path="/setup"><Setup /></Route>
        <Route path="/admin"><Admin /></Route>
        <Route path="/"><Stream /></Route>
      </Switch>
      </Router>
    </SignalProvider>
    <SmartData api={apiKey}/>
  </>
}

export default Root
