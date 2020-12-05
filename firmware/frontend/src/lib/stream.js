// Skeleton stream implementation

import {useState, useEffect} from "react";
import SockJS from 'sockjs-client'
import {Stomp} from "@stomp/stompjs";

const deviceID = process.env.REACT_APP_DEVICE_ID
console.log(process.env)

class P2PStream {
  stompClient;
  setError;
  constructor(stream, errorSetter) {
    this.stream = stream
    this.setError = errorSetter
  }

  open() {
    console.log("attempting to open stream")

    if (!deviceID) {
      this.setError("No Device ID set!")
      return
    }

    this.socket = new SockJS("http://localhost:8080/signaller")

    this.stompClient = Stomp.over(this.socket)

    this.stompClient.connect("", "",
      () => this.handleConnect(),
      (err) => this.handleError(err),
      () => this.handleClose())
  }

  // handle connecting and subscribing to topics for signalling
  handleConnect() {
    this.stompClient.subscribe('/signal/public', (payload) => this.handleSignal(payload))

    this.stompClient.send("/webrtc/webrtc.join",
      {},
      JSON.stringify({sender: deviceID, type: 'DEVICE_JOIN'})
      )
  }

  handleClose() {
    console.log("Remote connection unexpectedly terminated")
    this.setError("Remote connection not availiable - is the other Gromit turned on?")
  }

  // handle any possible errors
  handleError(err) {
    console.log("Error handled?")
    this.setError("An error occurred with the stream: " +  err)
  }

  handleSignal(signal) {
    let content = JSON.parse(signal)

    if (content.sender === deviceID) {
      return
    }

    switch (signal.type) {
      case 'DEVICE_JOIN':
        break
      case 'DEVICE_LEAVE':
        break
      case 'VIDEO_OFFER':
        break
      case 'VIDEO_ANSWER':
        break
      case 'NEW_ICE_CANDIDATE':
        break
    }
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
      let p2pStream = new P2PStream(videoSrc, setError)
      setStream(p2pStream)

      p2pStream.open()
    }
  }, [videoSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  return [videoSrc, error]
}

export {useStream, P2PStream}