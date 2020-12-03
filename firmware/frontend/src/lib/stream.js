// Skeleton stream implementation

import {useState, useEffect} from "react";
import SockJS from 'sockjs-client'

class P2PStream {
  constructor(stream) {
    this.stream = stream
    this.socket = new SockJS("http://localhost:8080/signaller")
  }

  open() {
    console.log("attempting to open stream")
  }
}

const useStream = (videoEl) => {
  // Initialize video state
  let [videoSrc, setVideoSrc] = useState(null)
  let [stream, setStream] = useState(null)
  let [error, setError] = useState(null)

  if (!videoSrc) {
    console.log("Attempting to get video")
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(setVideoSrc).catch((err) => setError(`Failed to initialize webcam.\n Error: ${err}`))
  }

  useEffect(() => {
  // Try and fetch user webcam
    console.log("Init stream")

    // If we have video but no stream, try and open a stream
    if (videoSrc && !stream) {
      let p2pStream = new P2PStream(videoSrc)
      setStream(p2pStream)

      p2pStream.open()
      setError("Can't open stream")
    }
  }, [videoSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  return [videoSrc, error]
}

export {useStream, P2PStream}