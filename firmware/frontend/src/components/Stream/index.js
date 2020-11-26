import React, {useEffect, useRef} from 'react'
import {useStream} from "../../lib/stream"

const Stream = () => {
  let stream = useStream()
  let videoEl = useRef(null)

  useEffect(() => {
    if (!videoEl.current) {
      return
    }

    let video = videoEl.current
    console.log(video)
    video.srcObject = stream
    video.play()

  }, [videoEl, stream])

  if (stream) {
    return <video autoPlay ref={videoEl} />
  } else {
    return <p>Could not obtain video</p>
  }
}

export default Stream