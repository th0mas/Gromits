import React from 'react'
import useResource from "../../services/api";
import {Login} from './login'
import {SetupServer} from "./SetupServer"

import submarine from './submarine.svg'

const Admin = () => {
  let {data, isLoading} = useResource("setup/status")
  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-blue-400 to-green-400 flex">
      <div className="bg-white p-4 rounded-2xl m-auto w-1/3 shadow">
        <div className="flex space-x-2 items-center pb-4 mb-2 border-b-2">
          <img src={submarine} className="h-7 w-7"/>
          <p className="text-2xl font-bold">Ocean Gromits</p>
        </div>
        { isLoading ? <p>Loading....</p> :
          data ? <Login /> : <SetupServer />
        }

      </div>
    </div>
  )
}

export default Admin