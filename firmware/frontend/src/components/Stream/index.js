import React, {useEffect, useRef, useContext} from 'react'
import InfoBox from "../InfoBox";

import styles from './Stream.module.scss'
import {useVideoStream} from "../../lib/stream";
import {SignalContext} from "../../contexts";
import ConnectionInfoBox from "../ConnectionInfoBox";

const Stream = () => {
  let videoEl = useRef(null)
  let {videoSrc, streamState, streamErr} = useVideoStream()
  let {err} = useContext(SignalContext)

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) { // Only run this effect if the ref is assigned
      return
    }
    console.log(navigator.mediaDevices)
    console.log(videoSrc)
    videoSrc
      ? video.srcObject = videoSrc
      : navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          video.srcObject = stream
        })

  }, [videoSrc])

  return <div className={styles.container}>
    <video autoPlay ref={videoEl} />
    <ConnectionInfoBox info = {streamState}/>

    {/* If we have any errors, render them here*/}
    { streamErr && <InfoBox info={streamErr} />}
    { err && <InfoBox info={err} />}
  </div>
}

export default Stream
