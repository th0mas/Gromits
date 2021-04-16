import React from 'react'
import QRCode from 'qrcode.react'

export const SetupPromptBox = () => {
  return <div className="bg-gradient-to-tr from-blue-500 to-blue-400 rounded-lg">
    <div className="p-2 flex flex-col">
      <p className="pb-2 font-bold text-gray-100">Scan the QR Code for Setup</p>
      <div className="bg-white p-4 rounded justify-center shadow-lg">
        <QRCode value={`https://gromit.local/${window.location}`} renderAs="svg" className="w-full h-full"/>
      </div>
    </div>
  </div>
}