import React, { useEffect, useRef, useState } from 'react'

import licence from './licence.txt'

const Info = ({acknowledgements, privacy}) => {
  return <div className="container mx-auto px-64">
    {acknowledgements && <Acknowledgements />}
    {privacy && <Privacy />}
    </div>
}

const Acknowledgements = () => {
  let [text, setText] = useState()
  let fileRef = useRef()

  useEffect(() => {
    fetch(licence).then((r) => r.text()).then(t => setText(t))
  }, [])

  return <>
    <h2 className="text-xl font-bold">Acknowledgements</h2>
    <h3 className="text-lg font-bold">Images</h3>
    <div>Info icon made by <a href="https://www.flaticon.com/authors/dmitri13" title="dmitri13">dmitri13</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    <div>Submarine icon made by <a href="https://www.flaticon.com/authors/cursor-creative" title="Cursor Creative">Cursor Creative</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

    <h3 className="text-lg font-bold">Licences</h3>
    <p ref={fileRef} className="whitespace-pre-line font-mono text-xs">
      {text}
    </p>
  </>
}

const Privacy = () => {
  return <>
    <h2 className="text-xl font-bold">Privacy notice</h2>
    <p>
      Ocean Gromits stores no personally identifiable infomation either locally
      or on our servers. If you have an Admin account, we store your username
      and a hashed representation of your password to authenticate you. This is
      never passed to third parties.
    </p>
    <p>
      Video streams are sent directly to other clients over an encrypted tunnel.
      None of this video data is stored on any device and can only be viewed by
      the other Gromit, or by a trusted system administrator for the purposes of
      moderation.
    </p>
  </>
}

export default Info