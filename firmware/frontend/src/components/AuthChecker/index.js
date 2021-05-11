import React, { useContext } from 'react'
import {useHistory} from 'react-router-dom'
import { TokenContext } from '../../contexts'
import { hasRole } from '../../lib/tokenUtils'

const AuthChecker = ({children}) => {
  let [token] = useContext(TokenContext)
  let history = useHistory()

  if (token) {
    console.log("running token check")
    if (hasRole(token, 'ROLE_ADMIN')) {
      console.log("returning children")
      return children
    } else {
      history.push('/auth')
    }
  }

  return ''
}

export default AuthChecker