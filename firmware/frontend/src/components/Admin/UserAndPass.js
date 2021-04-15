import React from 'react'

export const UserAndPass = ({setUser, setPass}) => {

  return <>
    <div className="relative flex w-full flex-wrap items-stretch mb-3">
      <input type="text" placeholder="Username"
             className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm
               border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10"
             onChange={(e) => setUser(e.target.value)}
      />
    </div>
    <div className="relative flex w-full flex-wrap items-stretch mb-3">
      <input type="password" placeholder="Password"
             className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm
               border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10"
             onChange={(e) => setPass(e.target.value)}
      />
    </div>
    </>
}