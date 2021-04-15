import React, {useState} from 'react'
import {UserAndPass} from "./UserAndPass";

export const SetupServer = () => {
  let [user, setUser] = useState("")
  let [pass, setPass] = useState("")

  return <div className="pt-4">
    <p className="pb-4">This server has not yet been setup, please create an admin account below.</p>
    <UserAndPass setUser={setUser} setPass={setPass} />

    <button
      className="bg-blue-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
    >
      Setup
    </button>
  </div>
}