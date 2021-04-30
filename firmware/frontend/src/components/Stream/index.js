import React, {useEffect, useRef, useContext} from 'react'
import InfoHolder from "../InfoHolder"
import InfoBox from "../InfoBox";

import {useVideoStream} from "../../lib/stream";
import {SignalContext} from "../../contexts";
import useResource from "../../services/api";
import {SetupPromptBox} from "../InfoBox/SetupPromptBox";

const Stream = () => {
  let videoEl = useRef(null)
  let {videoSrc, streamErr} = useVideoStream()
  let {err} = useContext(SignalContext)

  let {data, isLoading} = useResource("setup/status")

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) { // Only run this effect if the ref is assigned
      return
    }
    videoSrc
      ? video.srcObject = videoSrc
      : navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          video.srcObject = stream
        }).catch((e) => {})

  }, [videoSrc])

  return <div className="h-screen w-screen overflow-hidden">
    <video autoPlay ref={videoEl} className="h-screen w-screen object-cover"/>

    <InfoHolder>
      {/* If we have any errors, render them here*/}
      {(!isLoading && !data) && <SetupPromptBox />}
      { (data && streamErr) && <InfoBox info={streamErr} />}
      { (data && err) && <InfoBox info={err} />}
      {<InfoBox info={"Hello! Just to let you know, there is a camera in my periscope and it's currently sending a live video feed to my friend's porthole screen. If you look in my porthole, you can see what is happening where my friend is."}}
    </InfoHolder>
  </div>
}

export default Stream
