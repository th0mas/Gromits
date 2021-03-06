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
import AuthChecker from '../AuthChecker';

const signalServerPath = process.env.REACT_APP_SIGNAL_URL  || "http://localhost:8080"
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY

const Root = () => {
  return <>
      <TokenProvider>
      <Router>
      <Switch>
        <Route path="/auth"><Auth /></Route>
        <SignalProvider url={signalServerPath + "/signaller"}>
          <Route path="/dash">
          <DashLayout>
            <Route path="/dash/acknowledgements"><Info acknowledgements /></Route>
            <Route path="/dash/privacy"><Info privacy /></Route>
            <Route path="/dash/" exact ><AuthChecker children={<Dash />} /></Route>
          </DashLayout>
          </Route>
          <Route exact path="/"><Stream /><SmartData api={apiKey}/></Route>
        </SignalProvider>
      </Switch>
      </Router>
      </TokenProvider>
  </>
}

export default Root
