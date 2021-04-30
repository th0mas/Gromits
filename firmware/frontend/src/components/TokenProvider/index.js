import React, { useEffect } from 'react'
import {TokenContext} from "../../contexts";
import { post } from '../../services/api';
import useToken from "../../services/token";

const deviceId = "gromit_" + Math.random().toString(36).substring(7)

const TokenProvider = ({children}) => {
  let [token, setToken, tokenLoaded] = useToken()

  useEffect(() => {
    if (!token && tokenLoaded) {
      console.log("Resetting token...")
      post("client/register", {
        name: deviceId
      }).then(r => setToken(r.token))
    }
  }, [token, setToken, tokenLoaded])

  return <TokenContext.Provider value={[token, setToken]}>
    {children}
  </TokenContext.Provider>
}

export default TokenProvider