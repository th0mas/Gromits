// Skeleton stream implementation

import {useState, useEffect} from "react";

class P2PStream {
  constructor(stream) {
    this.stream = stream
  }

  open() {
    console.log("attempting to open stream")
  }
}

const useStream = (videoEl) => {
  // Initialize video state
  let [videoSrc, setVideoSrc] = useState(null)
  let [stream, setStream] = useState(null)

  if (!videoSrc) {
    console.log("Attempting to get video")
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(setVideoSrc).catch(console.log)
  }

  useEffect(() => {
  // Try and fetch user webcam
    console.log("Init stream")

    // If we have video but no stream, try and open a stream
    if (videoSrc && !stream) {
      let p2pStream = new P2PStream(videoSrc)
      setStream(p2pStream)

      p2pStream.open()
    }
  }, [videoSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  return videoSrc
}

export {useStream, P2PStream}