// Skeleton stream implementation

import {useState, useEffect} from "react";
import SockJS from 'sockjs-client'
import {Stomp} from "@stomp/stompjs";

const deviceID = process.env.REACT_APP_DEVICE_ID
const signalServerPath = process.env.NODE_ENV === "production" ? "https://gromit.tomh.uk" : "http://localhost:8080"
console.log(process.env)

class P2PStream {

  stompClient;
  setError;
  setVideoSrc;
  peerConnection;

  constructor(stream, errorSetter) {
    this.stream = stream
    this.setError = errorSetter
  }

  open(setVideoSrc) {
    console.log("attempting to open stream")

    if (!deviceID) {
      this.setError("No Device ID set!")
      return
    }

    this.socket = new SockJS(signalServerPath + "/signaller")

    this.setVideoSrc = setVideoSrc

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
    let content = JSON.parse(signal.body)

    if (content.sender === deviceID) {
      console.log("Ignoring message from myself")
      return
    }
    console.log("Analysing message")
    switch (content.type) {
      case "DEVICE_JOIN":
        this.startStream(content)
        break
      case 'DEVICE_LEAVE':
        break
      case 'VIDEO_OFFER':
        this.handleVideoOffer(content)
        break
      case 'VIDEO_ANSWER':
        this.handleVideoAnswer(content)
        break
      case 'NEW_ICE_CANDIDATE':
        this.handleNewICECandidate(content)
        break
      default:
        console.log("Unknown message")
    }
  }

  startStream(signal) {
    console.log("Device joined - attempting to start video connection")
    this.createConnection()

    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(
      (videoStream) => videoStream
      .getVideoTracks()
      .forEach(track => this.peerConnection.addTrack(track, videoStream))
    ).catch(() => this.setError("Error sending video to stream"))
  }

  handleVideoOffer(signal) {
    this.createConnection()

    let desc = new RTCSessionDescription(signal.content)

    // Haha oh no spaghetti promises
    this.peerConnection.setRemoteDescription(desc).then(() => {
      return navigator.mediaDevices.getUserMedia({video: true})
    }).then((videoStream) => {
      videoStream
        .getVideoTracks()
        .forEach(track => this.peerConnection.addTrack(track, videoStream))
    }).then(() => {
      return this.peerConnection.createAnswer()
    }).then((ans) => {
      return this.peerConnection.setLocalDescription(ans)
    }).then(() => {
      this.send({
        sender: deviceID,
        type: 'VIDEO_ANSWER',
        content: this.peerConnection.localDescription
      })
    }).catch((err) => {
      this.setError("Error negotiating video")
      console.log(err)
    })
  }

  handleNewICECandidate(signal) {
    let candidate = new RTCIceCandidate(signal.content)
    console.log(candidate)

    this.peerConnection.addIceCandidate(candidate)
  }

  createConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun2.l.google.com:19302" // Sorry Google - we should use servers we actually own
        },
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })

    this.peerConnection.onicecandidate = (e) => this.handleICECandidateEvent(e)
    this.peerConnection.ontrack = (e) => this.handleTrackEvent(e)
    this.peerConnection.onnegotiationneeded = (e) => this.handleNegotiationNeeded(e)
  }

  handleVideoAnswer(signal) {
    let desc = new RTCSessionDescription(signal.content)
    this.peerConnection.setRemoteDescription(desc)
  }


  handleICECandidateEvent(e) {
    if (e.candidate) {
      this.send({
        sender: deviceID,
        type: 'NEW_ICE_CANDIDATE',
        content: e.candidate
      })
    }
  }

  handleTrackEvent(e) {
    this.setVideoSrc = e.streams[0]
  }

  handleNegotiationNeeded(e) {
    this.peerConnection.createOffer().then(offer => {
      return this.peerConnection.setLocalDescription(offer)
    }).then(() => {
      this.send({
        sender: deviceID,
        type: 'VIDEO_OFFER',
        content: this.peerConnection.localDescription
      })
      }).catch((err) => {
        this.handleError(err)
    })
  }

  send(obj) {
    this.stompClient.send("/webrtc/webrtc.signal", {}, JSON.stringify(obj))
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

    let p2pStream = new P2PStream(videoSrc, setError)
    setStream(p2pStream)

    p2pStream.open(setVideoSrc)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [videoSrc, error]
}

export {useStream, P2PStream}