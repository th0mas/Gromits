import React, {useEffect, useRef, useContext} from 'react'
import InfoHolder from "../InfoHolder"
import InfoBox from "../InfoBox";

import {useVideoStream} from "../../lib/stream";
import {SignalContext} from "../../contexts";

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

  return <div className="h-screen w-screen overflow-hidden">
    <video autoPlay ref={videoEl} className="h-screen w-screen object-cover"/>

    <InfoHolder>
      {/* If we have any errors, render them here*/}
      { streamErr && <InfoBox info={streamErr} />}
      { err && <InfoBox info={err} />}
    </InfoHolder>
  </div>
}

export default Stream
