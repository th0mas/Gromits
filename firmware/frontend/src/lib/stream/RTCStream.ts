
class RTCStream {
  sendSignal: Function
  setError: Function
  localStream?: MediaStream
  peerConnection: RTCPeerConnection
  setRemoteStream?: (stream: MediaStream) => void 
  onConnectionStateChange: (e: Event) => void

  constructor (sendSignal: Function, setError: Function,
    onConnectionStateChange: (e: Event) => void
    ) {
    this.sendSignal = sendSignal
    this.setError = setError
    this.onConnectionStateChange = onConnectionStateChange

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
    this.peerConnection.onnegotiationneeded = () => this.handleNegotiationNeeded()

    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(
        track => this.peerConnection.addTrack(track, this.localStream!)
      )
    }
  }

  close(): void {
    if (this.peerConnection) {
      return this.peerConnection.close()
    }
  }

  handleRemoteStream(f: (stream: MediaStream) => void) {
    this.setRemoteStream = f
  }

  setLocalStream(stream: MediaStream) {
    this.localStream = stream
  }

  setConnectionCallback(callback: (state: string) => void): void {
    this.onConnectionStateChange = 
      (_e: Event) => callback(this.peerConnection.connectionState)

    callback("new")
  }

  handleVideoOffer(offer: RTCSessionDescriptionInit) {
    this.setError(null)

    let desc = new RTCSessionDescription(offer)

    this.peerConnection.setRemoteDescription(desc)
    .then(() => this.peerConnection.createAnswer())
    .then((ans) => this.peerConnection.setLocalDescription(ans))
    .then(() => this.sendSignal({
      type: 'VIDEO_ANSWER',
      content: this.peerConnection.localDescription
    }))
  }

  handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      this.sendSignal({
        type: 'NEW_ICE_CANDIDATE',
        content: e.candidate
      })
    }
  }

  handleNewICECandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }
  
  // Used when recieving remote tracks
  handleTrackEvent(e: RTCTrackEvent) {
    console.log("New track received")

    if (this.setRemoteStream) { this.setRemoteStream(e.streams[0]) }
  }

  handleNegotiationNeeded() {
    this.peerConnection.createOffer().then(offer => {
      return this.peerConnection.setLocalDescription(offer)
    }).then(() => {
      this.sendSignal({
        type: 'VIDEO_OFFER',
        content: this.peerConnection.localDescription
      })
    })
  }
}

export {RTCStream}