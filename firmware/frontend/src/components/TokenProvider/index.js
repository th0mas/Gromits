import React, { useEffect } from 'react'
import {TokenContext} from "../../contexts";
import { post } from '../../services/api';
import useToken from "../../services/token";

const TokenProvider = ({children}) => {
  let [token, setToken] = useToken()

  useEffect(() => {
    if (token === "INVALID") {
      console.log("Resetting token...")
      post("client/register", {
        name: "gromit_test"
      }).then(r => setToken(r.token))
    }
  }, [token, setToken])

  return <TokenContext.Provider value={[token, setToken]}>
    {children}
  </TokenContext.Provider>
}

export default TokenProvider