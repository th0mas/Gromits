import React, {useEffect, useRef, useContext, useState, useCallback} from 'react'
import InfoHolder from "../InfoHolder"
import InfoBox from "../InfoBox";

import {useVideoStream} from "../../lib/stream";
import {SignalContext} from "../../contexts";
import useResource from "../../services/api";
import {SetupPromptBox} from "../InfoBox/SetupPromptBox";

const Stream = () => {
  let videoEl = useRef(null)
  let [localStream, setLocalStream] = useState()
  let {videoSrc, streamErr} = useVideoStream(localStream)
  let {err} = useContext(SignalContext)

  let {data, isLoading} = useResource("setup/status")

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(s => setLocalStream(s))
    }, [])

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) { // Only run this effect if the ref is assigned
      return
    }
    if (videoSrc || localStream) {
      video.srcObject = videoSrc || localStream
    }
  }, [videoSrc, localStream])

  return <div className="h-screen w-screen overflow-hidden">
    <video autoPlay ref={videoEl} className="h-screen w-screen object-cover"/>

    <InfoHolder>
      {/* If we have any errors, render them here*/}
      {(!isLoading && !data) && <SetupPromptBox />}
      { (data && streamErr) && <InfoBox info={streamErr} />}
      { (data && err) && <InfoBox info={err} />}
    </InfoHolder>
  </div>
}

export default Stream
