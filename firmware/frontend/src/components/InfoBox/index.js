import React from 'react'

import warning from './warning.svg'

const InfoBox = ({info}) => {
  return <div className="bg-gradient-to-tr from-yellow-500 to-yellow-300 rounded-lg">
    <div className="p-2 flex flex-row inline-flex items-center space-x-1">
      <img src={warning} className="h-5 w-5"></img>
      <p>{info}</p>
  </div>
  </div>
}

export default InfoBox