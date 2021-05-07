import React from 'react'

import submarine from '../../images/submarine.svg'

const DashLayout = ({children}) => {
  return <div className="min-h-screen flex flex-col">
    <div className="flex space-x-2 items-center p-4 mb-2">
      <img src={submarine} className="h-7 w-7" alt="Ocean Gromits logo" />
      <p className="text-2xl font-bold">Ocean Gromits</p>
    </div>
      {children}
  </div>
}

export default DashLayout