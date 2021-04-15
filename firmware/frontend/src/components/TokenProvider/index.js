import React, { useEffect } from 'react'
import {TokenContext} from "../../contexts";
import { post } from '../../services/api';
import useToken from "../../services/token";

const TokenProvider = ({children}) => {
  let [token, setToken] = useToken()

  useEffect(() => {
    console.log(token)
    if (!token) {
      post("client/register", {
        name: "gromit_test"
      }).then(r => setToken(r.token))
    }
  }, [token])

  return <TokenContext.Provider value={[token, setToken]}>
    {children}
  </TokenContext.Provider>
}

export default TokenProvider