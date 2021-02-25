/*
Signaller is an abstraction over communicating with the signalling server itself.

Other parts of the application should only need to use the `send(obj)` method.

This file also defines a random device ID and our message type constants.
 */

import SockJS from 'sockjs-client'
import {Stomp} from "@stomp/stompjs";

const deviceId = Math.random().toString(36).substring(7)

export const DEVICE_JOIN = 'DEVICE_JOIN'
export const DEVICE_LEAVE = 'DEVICE_LEAVE'
export const VIDEO_OFFER = 'VIDEO_OFFER'
export const VIDEO_ANSWER = 'VIDEO_ANSWER'
export const NEW_ICE_CANDIDATE = 'NEW_ICE_CANDIDATE'

class Signaller {
  // Define stubs for vars to be set later.
  stompClient;
  socket;
  errCallback;

  callbacks;


  // Creates our socket and stompJs clients
  constructor(url, errCallback) {
    this.callbacks = []
    this.errCallback = errCallback

    this.socket = new SockJS(url)
    this.stompClient = Stomp.over(this.socket)
  }

  connect() {
    this.stompClient.connect("test", "test", // Currently use blank user + pass
      () => this.handleConnect(),
      (err) => this.handle(err),
      () => this.handleClose()
    )
  }

  // Abstract away our error handler a bit
  handle(err) {
    console.log(`Signal error: ${err}`)
    this.errCallback(`Signal: ${err}`)
  }

  // Allow other classes to register callbacks
  registerRTCCallback(callback) {
    this.callbacks.push(callback)
  }

  // Remove our callbacks - perf optimisation when using Hooks
  removeRTCCallback(_callback) {
    this.callbacks = [] // TODO: do this properly
  }

  // internal method to handle our initial connection and subscribe to needed channels
  handleConnect() {
    this.stompClient.subscribe('/signal/public', (payload) => this.handleSignal(payload))

    let payload = {
      sender: deviceId,
      type: DEVICE_JOIN
    }

    this.stompClient.send("/webrtc/webrtc.join",
      {},
      JSON.stringify(payload)
      )
  }

  // Render a nice error for closed connections
  handleClose() {
    this.handle("Connection closed")
  }

  // Relay our signals to all listening clients.
  //  - might not be needed in the end but worth buulding
  //    out now
  handleSignal(signal) {
    let content = JSON.parse(signal.body)
    if (content.sender === deviceId) {
      console.log("discarding own message")
      return
    }

    this.callbacks.forEach((callback) => callback(content))
  }

  send(obj) {
    let payload = {...obj, sender: deviceId}
    this.stompClient.send("/webrtc/webrtc.signal", {}, JSON.stringify(payload))
  }


}

export {Signaller}