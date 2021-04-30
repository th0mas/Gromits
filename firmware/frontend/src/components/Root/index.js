import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import Stream from '../../pages/Stream'
import SignalProvider from "../SignalProvider";
import SmartData from '../SmartData/index.js'
import Auth from "../../pages/Auth";
import TokenProvider from "../TokenProvider";
import Dash from '../../pages/Dash';
import Info from '../../pages/Info'
import DashLayout from '../DashLayout';

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY

const Root = () => {
  return <>
      <TokenProvider>
      <Router>
      <Switch>
        <Route path="/auth"><Auth /></Route>
        <SignalProvider url={signalServerPath + "/signaller"}>
          <DashLayout>
            <Route path="/dash"><Dash /></Route>
            <Route path="/acknowledgements"><Info acknowledgements /></Route>
          </DashLayout>
          <Route exact path="/"><Stream /></Route>
        </SignalProvider>
      </Switch>
      </Router>
      </TokenProvider>
    {/* <SmartData api={apiKey}/> */}
  </>
}

export default Root
