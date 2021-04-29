import React, { useContext } from 'react'
import { TokenContext } from '../../contexts'
import { post } from '../../services/api'

const getDeveloperInfo = (client) => {
  let roles = client.authorities.map((role) => role.authority.replace("ROLE_", ""))

  return roles.join(" ")
}

export const ClientInfo = ({ client, getData }) => {

  let [token] = useContext(TokenContext)

  const authorizeClient = () => {
    post("admin/authorize_client", {
      name: client.name
    }, token)
    .then(setTimeout(() => getData(token), 250))
  }

  let authed = getDeveloperInfo(client).includes("VIDEO")

  return <div className="bg-gradient-to-tr from-blue-500 to-blue-600 shadow 
    p-2 max-w-lg h-20 rounded-xl text-white">
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <p className="font-light text-sm -mb-2">Client ID</p>
        <p className="font-bold text-lg">{client.name}</p>
      </div>
      <div className="flex-1">
        <p className="font-light text-sm -mb-2">Authorized?</p>
        <p className="font-bold text-lg">{authed ? "YES" : "NO"}</p>
      </div>
      <div className="flex-1">
        <p className="font-light text-sm ">Dev Data</p>
        <p className="font-bold text-sm">{getDeveloperInfo(client)}</p>
      </div>

      {authed ?
        <button className="bg-red-400 text-white active:bg-green-500 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
          >
          Watch
        </button>
        :
        <button className="bg-green-400 text-white active:bg-green-500 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
          onClick={authorizeClient}>
          Authorize
        </button>
      }
    </div>

  </div>
}