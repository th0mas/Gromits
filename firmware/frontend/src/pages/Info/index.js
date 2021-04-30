import React, { useEffect, useRef, useState } from 'react'

import licence from './licence.txt'

const Info = ({acknowledgements}) => {
  let [text, setText] = useState()
  let fileRef = useRef()

  useEffect(() => {
    fetch(licence).then((r) => r.text()).then(t => setText(t))
  }, [])

  return <div className="container mx-auto">
    <h2 className="text-xl font-bold">Acknowledgements</h2>
    <h3 className="text-lg font-bold">Images</h3>
    <div>Info icon made by <a href="https://www.flaticon.com/authors/dmitri13" title="dmitri13">dmitri13</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    <div>Submarine icon made by <a href="https://www.flaticon.com/authors/cursor-creative" title="Cursor Creative">Cursor Creative</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

    <h3 className="text-lg font-bold">Licences</h3>
    <p ref={fileRef} className="whitespace-pre-line font-mono text-xs">
      {text}
    </p>
  </div>
}

export default Info