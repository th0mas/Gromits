/*
P2PStream is the main interface for creating and managing streams.

It uses RTCStream (a simple abstraction over the native WebRTCConnection) to 
establish the connections and provides a mechanism for signals to be sent and 
received from them using the global application signaller.

If possible, try and avoid touching RTCStream as that should be best kept as 
thin a wrapper as possible over the native behaviour and just provide hooks
for required communication.

All stream objects are stored in the `peers` map, and signals passed to that
based off the `sender` parameter in the Signal. The sender parameter is set
server side *should* be secure to use.
*/

import { Signaller } from '../signal'
import { RTCStream } from './RTCStream'

export type Signal = {
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

  sendDefaultVideoStreamBeacon(): void {
    this.signaller.send({
      type: 'VIDEO_JOIN',
    })
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
      case "VIDEO_START":
        this.handleJoin(signal)
        break
      case 'VIDEO_OFFER':
        this.handleOffer(signal)
        break
      case 'VIDEO_ANSWER':
        this.handleVideoAnswer(signal)
        break
      case 'NEW_ICE_CANDIDATE':
        this.handleNewICECandidate(signal)
        break
      default:
        break
    }
  }

  handleJoin(signal: Signal) {
    this.peers.get(signal.sender)?.close()

    let stream = this.createStream(signal)

    stream.start()
  }

  handleDefaultJoin(signal: Signal) {
    if (this.defaultPeer) {
      this.peers.get(this.defaultPeer)?.close()
    }

    let stream = this.createDefaultStream(signal)

    stream.start()
  }

  handleOffer(signal: Signal) {
    if (this.peers.has(signal.sender)) {
      this.peers.get(signal.sender)?.handleVideoOffer(signal.content)
    } else {
      let stream = this.createDefaultStream(signal)

      stream.handleVideoOffer(signal.content)
    }
  }

  handleDefaultOffer(signal: Signal) {
    if (this.defaultPeer && this.peers.has(this.defaultPeer)) {
      this.peers.get(this.defaultPeer)?.handleVideoOffer(signal.content)
    } else {
      let stream = this.createDefaultStream(signal)

      stream.handleVideoOffer(signal.content)
    }
  }

  handleVideoAnswer(signal: Signal) {
    if (!this.peers.has(signal.sender)) {
      console.log(`Stream for ${signal.sender} not initialized: \n ${signal.toString()}`)
    }

    this.peers.get(signal.sender)?.handleVideoOffer(signal.content)
  }

  handleNewICECandidate(signal: Signal) {
    if (!this.peers.has(signal.sender)) {
      console.log(`Stream for ${signal.sender} not initialized: \n ${signal.toString()}`)
    }

    this.peers.get(signal.sender)?.handleNewICECandidate(signal.content)
  }

  createStream(signal: Signal): RTCStream {
    let stream = new RTCStream(
      (msg: Signal) => this.sendSignal(msg, signal.sender),
      this.setError,
      function () { } // TODO: Add conn status reducer
    )

    if (this.localStream) {
      stream.setLocalStream(this.localStream)
    }

    return stream

  }

  createDefaultStream(signal: Signal): RTCStream {
    let stream = this.createStream(signal)
    this.peers.set(signal.sender, stream)
    this.defaultPeer = signal.sender
    
    

    if (this.setRemoteStream) {
      // This is worded poorly and only registers a callback
      stream.handleRemoteStream(this.setRemoteStream)
    }

    return stream
  }

  sendSignal(msg: Signal, to: string | undefined) {
    // this is really hacky :/
    // We don't want to send default stream offers on private channels
    // This intercepts the message and removes the 'to' parameter.
    if (msg.type === 'VIDEO_OFFER' && to === this.defaultPeer) {
      to = undefined
    }
    this.signaller.send(msg, to)
  }

}

export default P2PStream