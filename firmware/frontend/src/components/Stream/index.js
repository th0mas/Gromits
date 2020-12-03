import React, {useEffect, useRef} from 'react'
import {useStream} from "../../lib/stream"
import InfoBox from "../InfoBox";

import styles from './Stream.module.scss'

const Stream = () => {
  let [stream, error] = useStream()
  let videoEl = useRef(null)

  useEffect(() => {
    if (!videoEl.current) {
      return
    }

    let video = videoEl.current
    console.log(video)
    video.srcObject = stream

  }, [videoEl, stream])

  return <>
    <div className={styles.container}>
      { !stream || <video autoPlay ref={videoEl} /> }


      { !error || <InfoBox info={error} />}
    </div>
    </>
}

export default Stream