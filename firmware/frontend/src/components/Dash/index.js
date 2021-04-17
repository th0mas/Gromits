import React, { useContext } from 'react'
import { TokenContext } from '../../contexts'

import submarine from '../../images/submarine.svg'
import { decodeToken } from '../../lib/tokenUtils'
import useResource from '../../services/api'
import { ClientInfo } from './ClientInfo'

const Dash = () => {
  let { data, isLoading, error } = useResource("admin/clients")
  let [token] = useContext(TokenContext)

  let me = decodeToken(token).sub

  if (isLoading || !data) return <p>Loading...</p>
  if (error) return <p>Something has gone really wrong</p>

  data = data.filter(item => item !== me)

  return <div className="flex flex-col h-screen">
    <div className="flex space-x-2 items-center p-4 mb-2">
      <img src={submarine} className="h-7 w-7" alt="Ocean Gromits logo"/>
      <p className="text-2xl font-bold">Ocean Gromits</p>
    </div>

    <div className="flex h-full">

      <div className="bg-white flex h-5/6 flex-col space-y-2 p-4 pb-8 m-4 mb-8 rounded shadow-2xl">
        {data.map((client, index) => 
          <ClientInfo name={client} key={index} />
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
          <p className="font-light text-xl text-gray-800">Please select a stream to monitor</p>
      </div>
    </div>
    <div className="flex flex-col justify-center items-center text-gray-500 text-sm">
      <p>Built by University of Bristol students 2020-2021</p>
      <p>Privacy Notice | Acknowledgements | Reset Server </p>
    </div>
  </div>
}

export default Dash