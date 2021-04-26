// Creates and Manages all our P2P Streams

import { Signaller } from '../signal'
import { RTCStream } from './RTCStream'

type Signal = {
  type: string,
  content: Object,
  sender: string
}

class P2PStream {
  signaller: Signaller
  setStream: (stream: MediaStream) => void
  setError: (a: string | Error) => void
  localStream?: MediaStream
  setRemoteStream?: (a: MediaStream) => void
  connectionStatusCallback?: (a: any) => void

  /*
  Contains an array of our peers, peers[0] contains the default stream
  that is displayed
  */
  peers = new Map<string, RTCStream>()
  defaultPeer?: string

  constructor(signaller: Signaller, setStream: (a: MediaStream) => void,
    setError: (a: string | Error) => void
  ) {
    this.signaller = signaller
    this.setStream = setStream
    this.setError = setError

  }

  setLocalStream(stream: MediaStream) {
    this.localStream = stream

    this.peers.forEach((peer) => peer.setLocalStream(stream))
  }

  setRemoteStreamCallback(f: (a: MediaStream) => void) {
    this.setRemoteStream = f

    this.peers.forEach((peer) => peer.handleRemoteStream(f))
  }

  setConnectionStatusCallback(f: (a: any) => void) {
    this.connectionStatusCallback = f

    this.peers.forEach((peer) => peer.setConnectionCallback(f))
  }

  // Presume only the default stream will happen on the default channel
  handleSignal(signal: Signal) {
    switch (signal.type) {
      case "VIDEO_JOIN":
        this.handleDefaultJoin(signal)
        break
      case 'VIDEO_OFFER':
        this.handleDefaultOffer(signal)
        break
      default:
        console.log(`Unknown message: \n ${signal}`)
    }
  }

  handleDirectSignal(signal: Signal) {
    switch (signal.type) {
      case 'VIDEO_ANSWER':
        // this.handleVideoAnswer(signal)
        break
      case 'NEW_ICE_CANDIDATE':
        // this.handleNewICECandidate(signal)
        break
      default:
        break
    }

  }

  handleDefaultJoin(signal: Signal) {
    if (this.defaultPeer) {
      this.peers.get(this.defaultPeer)?.close()
    }

    let stream = this.createDefaultStream(signal)

    stream.start()
  }

  handleDefaultOffer(signal: Signal) {
    if (this.defaultPeer && this.peers.has(this.defaultPeer)) {
      this.peers.get(this.defaultPeer)?.handleVideoOffer(signal.content)
    } else {
      let stream = this.createDefaultStream(signal)

      stream.handleVideoOffer(signal.content)
    }
  }

  createDefaultStream(signal: Signal): RTCStream {
    let stream = new RTCStream(
      (msg: Object) => this.sendSignal(msg, signal.sender),
      this.setError,
      function () { } // TODO: Add conn status reducer
    )

    this.peers.set(signal.sender, stream)
    this.defaultPeer = signal.sender
    
    if (this.localStream) {
      stream.setLocalStream(this.localStream)
    }

    if (this.setRemoteStream) {
      stream.handleRemoteStream(this.setRemoteStream)
    }

    return stream
  }

  sendSignal(msg: Object, to: string) {
    this.signaller.send(msg, to)
  }

}

export default P2PStream