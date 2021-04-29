import { Signal } from "./P2PStream"

class RTCStream {
  sendSignal: Function
  setError: Function
  localStream?: MediaStream
  pc: RTCPeerConnection
  setRemoteStream?: (stream: MediaStream) => void 
  onConnectionStateChange!: (e: Event) => void

  makingOffer: boolean = false
  ignoreOffer: boolean = false
  polite: boolean = true

  constructor (sendSignal: Function, setError: Function,
    onConnectionStateChange: (e: string) => void
    ) {
    this.sendSignal = sendSignal
    this.setError = setError
    
    this.setConnectionCallback(onConnectionStateChange)

    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun2.l.google.com:19302" // Sorry Google - we should use servers we actually own
        },
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })

    this.pc.onicecandidate = (e) => this.handleICECandidateEvent(e)
    this.pc.ontrack = (e) => this.handleTrackEvent(e)
    this.pc.onnegotiationneeded = () => this.handleNegotiationNeeded()
    this.pc.onconnectionstatechange = (e) => this.onConnectionStateChange(e)
  }

  close(): void {
    if (this.pc) {
      return this.pc.close()
    }
  }

  start(): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(
        track => this.pc.addTrack(track, this.localStream!)
      )
      }
  }

  async handleSignal(signal: Signal) {
    try {
      if (signal.type === "VIDEO_OFFER" || signal.type === "VIDEO_ANSWER") {
        const offerCollision = (signal.type === "VIDEO_OFFER") && 
          (this.makingOffer || this.pc.signalingState !== "stable")
        
        this.ignoreOffer = !this.polite && offerCollision

        if (this.ignoreOffer) {return}

        await this.pc.setRemoteDescription(signal.content)

        if (signal.type === "VIDEO_OFFER") {
          // @ts-ignore
          await this.pc.setLocalDescription()
          this.sendSignal({type: "VIDEO_ANSWER", content: this.pc.localDescription})
        }
      } else if (signal.type === "NEW_ICE_CANDIDATE") {
        try {
          await this.pc.addIceCandidate(signal.content)
        } catch (err) {
          if (!this.ignoreOffer) {throw err}
        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  handleRemoteStream(f: (stream: MediaStream) => void) {
    this.setRemoteStream = f
  }

  setImpolite() {
    this.polite = false;
  }

  setLocalStream(stream: MediaStream) {
    this.localStream = stream
  }

  setConnectionCallback(callback: (state: string) => void): void {
    this.onConnectionStateChange = 
      (_e: Event) => callback(this.pc.connectionState)

    callback("new")
  }

  handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      this.sendSignal({
        type: 'NEW_ICE_CANDIDATE',
        content: e.candidate
      })
    }
  }
  
  // Used when recieving remote tracks
  handleTrackEvent(e: RTCTrackEvent) {
    console.log("New track received")

    if (this.setRemoteStream) { this.setRemoteStream(e.streams[0]) }
  }

  async handleNegotiationNeeded() {
    try {
      this.makingOffer = true;
      // @ts-ignore
      await this.pc.setLocalDescription()
      this.sendSignal({ 
        type: "VIDEO_OFFER", 
        content: this.pc.localDescription 
      })
    } catch(err) {
      console.error(err);
    } finally {
      this.makingOffer = false;
    }
  }
}

export {RTCStream}