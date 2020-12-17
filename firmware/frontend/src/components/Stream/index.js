import React, {useEffect, useRef} from 'react'
import InfoBox from "../InfoBox";

import styles from './Stream.module.scss'
import {useVideoStream} from "../../lib/stream";

const Stream = () => {
  let videoEl = useRef(null)
  let [stream, streamErr, sigErr] = useVideoStream()

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) { // Only run this effect if the ref is assigned
      return
    }
    console.log(stream)
    stream
      ? video.srcObject = stream
      : navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          video.srcObject = stream
        })

  }, [stream])

  return <div className={styles.container}>
    <video autoPlay ref={videoEl} />

    {/* If we have any errors, render them here*/}
    { streamErr && <InfoBox info={streamErr} />}
    { sigErr && <InfoBox info={sigErr} />}
  </div>
}

export default Stream