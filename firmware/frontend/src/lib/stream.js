// Skeleton stream implementation

import {useState, useEffect, useContext} from "react"
import {SignalContext} from "../contexts"

const deviceID = Math.random().toString(36).substring(7) // Hack for testing

class P2PStream {

  signaller;
  setError;
  setVideoSrc;
  peerConnection;

  constructor(signaller, errorSetter) {
    this.signaller = signaller
    this.setError = errorSetter
  }

  open(setVideoSrc) {
    this.signaller.registerRTCCallback((content) => this.handleSignal(content))

    if (!deviceID) {
      this.setError("No Device ID set!")
      return
    }

    this.setVideoSrc = setVideoSrc

  }

  handleError(err) {
    this.setError(err)
  }

  handleSignal(content) {
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

  startStream() {
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
    console.log("New track!")
    this.setVideoSrc(e.streams[0])
  }

  handleNegotiationNeeded() {
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

  send(content) {
    this.signaller.send(content)
  }


}

const useVideoStream = () => {
  let [videoSrc, setVideoSrc] = useState(null)
  let [err, setErr] = useState(null)
  let {signaller, sigErr} = useContext(SignalContext)

  useEffect(() => {
    let p2pStream = new P2PStream(signaller, setErr)

    p2pStream.open(setVideoSrc)
  }, [signaller])

  return [videoSrc, err, sigErr]
}

export {useVideoStream, P2PStream}