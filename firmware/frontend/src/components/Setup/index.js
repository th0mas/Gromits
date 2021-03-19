import React from 'react'
import QRCode from 'qrcode.react'

const Setup = () => (
  <div className={"container"}>
    <h1>This Gromit needs setting up</h1>
    <h3>You'll need access to an Admin screen.</h3>
    <QRCode value={window.location} />
  </div>

)

export default Setup