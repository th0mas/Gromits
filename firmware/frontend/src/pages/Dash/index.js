import React, {useContext, useEffect, useReducer, useState} from 'react'
import { TokenContext } from '../../contexts'

import {StreamMonitor} from './StreamMonitor'

import { decodeToken } from '../../lib/tokenUtils'
import { ClientInfo } from './ClientInfo'
import {get} from "../../services/api";
import { initialState, reducer } from './reducer'

const Dash = () => {
  let [state, dispatch] = useReducer(reducer, initialState)
  let [token] = useContext(TokenContext)

  let {data, error, isLoading} = state

  const setPeer = (clientName) => {
    console.log('setting streaming target to: ' + clientName)
    dispatch({
      type: 'set-client',
      data: clientName
    })
  }

  const getData = (token) => get("admin/clients", token)
    .then((data) => dispatch({
      type: 'loaded',
      data
    }))

  useEffect(() => {getData(token).catch(err => dispatch({
    type: 'error',
    error: err
  }))}, [token])

  let me = token ? decodeToken(token).sub : ""

  if (isLoading || !data) return <p>Loading...</p>
  if (error) return <p>Something has gone really wrong</p>

  data = data.filter(item => item.name !== me)

  return <div className="flex-1 flex flex-col h-full">

    <div className="flex flex-1 h-full items-center justify-center">
      {data.length > 0 ? <>

      <div className="bg-white flex h-5/6 flex-col space-y-2 p-4 pb-8 m-4 mb-8 rounded shadow-2xl">
        {data.map((client, index) => 
          <ClientInfo client={client} key={client.name} getData={getData} setPeer={setPeer}/>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center h-4/6 w-1/2">
          <StreamMonitor state={state}/>
      </div>

    </>
      : <div className=""><p>No Gromits are connected.</p></div>
      }
  </div>

    <div className="flex flex-col justify-center items-center text-gray-500 text-sm">
      <p>Built by University of Bristol students 2020-2021</p>
      <p>Privacy Notice | Acknowledgements | Reset Server </p>
    </div>
  </div>
}

export default Dash