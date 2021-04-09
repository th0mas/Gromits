import React from 'react'
import QRCode from 'qrcode.react'

const Setup = () => (
  <div className={"container"}>
    <h1>This Gromit needs setting up</h1>
    <h3>You'll need your admin login</h3>
    <QRCode value={`https://gromit.local/${window.location}`} />

    <p>Scan the QR code to setup</p>
  </div>

)

export default Setup