import React, {useEffect, useRef, useContext, useState, useCallback} from 'react'
import InfoHolder from "../InfoHolder"
import InfoBox from "../InfoBox";

import {useVideoStream} from "../../lib/stream";
import {SignalContext} from "../../contexts";
import useResource from "../../services/api";
import {SetupPromptBox} from "../InfoBox/SetupPromptBox";

const Stream = () => {
  let videoEl = useRef(null)
  let [webcamStream, setWebcamStream] = useState()
  let {videoSrc, streamErr, beaconCallback, setLocalStream} = useVideoStream()
  let {err, connectionStatus} = useContext(SignalContext)

  let {data, isLoading} = useResource("setup/status")

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(s => setWebcamStream(s))
    }, [])

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) { // Only run this effect if the ref is assigned
      return
    }
    if (videoSrc || webcamStream) {
      video.srcObject = videoSrc || webcamStream
    }
  }, [videoSrc, webcamStream])

  useEffect(() => {
    if (beaconCallback && connectionStatus && setLocalStream) {
      setLocalStream(webcamStream)
      beaconCallback()
    }
  }, [beaconCallback, connectionStatus, setLocalStream, webcamStream])

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
