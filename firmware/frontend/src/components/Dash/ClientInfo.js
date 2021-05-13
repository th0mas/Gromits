import React from 'react'

export const ClientInfo = ({name}) => {
  return <div className="bg-gradient-to-tr from-blue-500 to-blue-600 shadow 
    p-2 max-w-lg h-20 flex items-center space-x-4 rounded-xl text-white">
    <div className="flex-1">
      <p className="font-light text-sm -mb-2">Client ID</p>
      <p className="font-bold text-lg">{name}</p>
    </div>
    <div className="flex-1">
      <p className="font-light text-sm -mb-2">Authorized?</p>
      <p className="font-bold text-lg">No</p>
    </div>
    <div className="flex-1">
      <p className="font-light text-sm -mb-2">Streaming?</p>
      <p className="font-bold text-lg">No</p>
    </div>

    <button className="bg-green-400 text-white active:bg-green-500 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
      >
  Authorize
</button>
  </div>
}