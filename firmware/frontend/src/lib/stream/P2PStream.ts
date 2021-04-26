// Skeleton stream implementation

import { Signaller } from '../signal'
import {RTCStream} from './RTCStream'

class P2PStream {
  signaller: Signaller
  setStream: (stream: MediaStream) => void

  /*
   
  */
  peers: Array<string> = []

  constructor(signaller: Signaller, setStream: (a: MediaStream) => void) {
    this.signaller = signaller
    this.setStream = setStream
    
    
  }


  handleSignal(content: { type: any }) {
    switch (content.type) {
      case "DEVICE_JOIN":
        // Presume we want to use our default stream for this
        
        break
      case 'VIDEO_OFFER':
        // this.handleVideoOffer(content)
        break
      case 'VIDEO_ANSWER':
        // this.handleVideoAnswer(content)
        break
      case 'NEW_ICE_CANDIDATE':
        // this.handleNewICECandidate(content)
        break
      default:
        console.log(`Unknown message: \n ${content}`)
    }
  }

  handleDefaultJoin() {

  }

  handleDefaultOffer() {

  }

}

export default P2PStream