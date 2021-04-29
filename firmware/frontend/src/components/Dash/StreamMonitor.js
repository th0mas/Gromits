import React, { useEffect, useRef } from 'react'
import { useVideoStream } from '../../lib/stream'

export const StreamMonitor = ({ state: {active, peer} }) => {
  return <div className=" h-full w-full rounded-3xl m-4 mb-8 shadow-lg overflow-hidden relative">
    {
      active ? <PeerStream peer={peer} /> : <StreamPlaceholder />
    }
  </div>
}

const PeerStream = ({peer}) => {
  let videoEl = useRef(null)
  let {videoSrc, connectTo} = useVideoStream()

  useEffect(() => {
    if (connectTo) {
      console.log("Sending connect...")
      connectTo(peer)
    }
  }, [connectTo, peer])

  useEffect(() => {
    let video = videoEl.current

    if (!videoEl.current) {
      return
    }

    if (videoSrc) {
      video.srcObject = videoSrc
    }

  }, [videoSrc])
  return <video autoPlay ref={videoEl} className="h-full w-full">

  </video>
}

const StreamPlaceholder = () => (<>
  <div className="bg-vignette h-full w-full relative">
    <div className="bg-static animate-tv-static h-full w-full opacity-30 z-10 ">
    </div>
  </div>
  <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-white text-2xl shadow-xl z-100 ">Please select a stream to monitor.</p>
  </div>
</>)