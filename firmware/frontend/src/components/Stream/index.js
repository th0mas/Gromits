import React, {useEffect, useRef} from 'react'
import {useStream} from "../../lib/stream"

import styles from "./stream.module.scss"

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

    // video.requestFullscreen().catch((err) => console.log("Error going full screen", err))

  }, [videoEl, stream])

  if (stream) {
    return <video autoPlay ref={videoEl} className={styles.maxScreen}/>
  } else {
    return <p>Could not obtain video</p>
  }
}

export default Stream