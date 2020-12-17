import React, {useEffect, useRef} from 'react'
import InfoBox from "../InfoBox";

import styles from './Stream.module.scss'
import {useStream} from "../../lib/stream";

const Stream = () => {
  let videoEl = useRef(null)
  let [stream, streamErr] = useStream()

  useEffect(() => {
    let video = videoEl.current

    if (video) { // Only run this effect if the ref is assigned
      return
    }

    video.srcObject = stream
  })

  return <div className={styles.container}>
    {/* Render our video once we have a video stream */}
    { !stream || <video autoPlay ref={videoEl} />}

    {/* If we have any errors, render them here*/}
    { !streamErr || <InfoBox info={streamErr} />}
  </div>
}

export default Stream