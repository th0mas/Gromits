/*
Signaller is an abstraction over communicating with the signalling server itself.

Other parts of the application should only need to use the `send(obj)` method.

This file also defines a random device ID and our message type constants.
 */

import SockJS from 'sockjs-client'
import {Client} from "@stomp/stompjs";

const deviceId = "gromit_test"
//Math.random().toString(36).substring(7)

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
  authErrCallback;
  token;

  callbacks;


  // Creates our socket and stompJs clients
  constructor(url, errCallback) {
    this.callbacks = []
    this.errCallback = errCallback
      
    this.stompClient = new Client()
    this.stompClient.webSocketFactory = () => new SockJS(url)
  }

  connect() {
    console.log("Attempting connect....")

    // Set our header conditionally if we have a token or not
    this.stompClient.connectHeaders = this.token ? {token: this.token} : {name: deviceId}

    // Register our callbacks
    this.stompClient.onConnect = () => this.handleConnect()
    this.stompClient.onStompError = err => this.handle(err)
    this.stompClient.onWebSocketClose = (err) => this.handleClose(err)
    this.stompClient.onWebSocketError = err => this.handle("WS: " + err)

    // Cleanly disconnect from old socket
    // We need this as we sometimes call `connect` on an already open socket with different tokens/roles.
    // This helps our server recognise our new roles and keeps our state management cleaner.
    try {
      this.stompClient.deactivate()
        .then(this.stompClient.activate())
    } catch (e) {
      console.log(e)
    }

  }

  disconnect() {
    this.stompClient.deactivate()
  }

  setToken(token) {
    this.token = token
  }

  setAuthErrCallback(f) {
    this.authErrCallback = f
  }

  // Abstract away our error handler a bit
  handle(frame) {
    this.errCallback(`Signal: ${frame}`)

    if (frame.headers) {
      if (frame.headers.message.includes("Access is denied") || frame.headers.message.includes("SignatureException")) {
        console.log("attempting auth callback...")
        this.authErrCallback()
      }
    }
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
    this.registerSubscriptions()

    let payload = {
      sender: deviceId,
      type: DEVICE_JOIN
    }

    this.stompClient.publish({
      destination: "/webrtc/join",
      body: JSON.stringify(payload)
    })
  }

  registerSubscriptions() {
    this.stompClient.subscribe('/signal/public', (payload) => this.handleSignal(payload))

    // Work around for https://stackoverflow.com/questions/67108426/
    // if (this.token) {
    //   this.stompClient.subscribe('/signal/private', (payload) => this.handleSignal(payload))
    // }
  }

  // Render a nice error for closed connections
  handleClose(err) {
    if (err.code === 1002) {
      this.handle("Connection to server lost")
      
    } else {
      this.handle(err.reason)
    }
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
    this.stompClient.publish({
      destination: "/webrtc/signal",
      body: JSON.stringify(payload)
    })

  }


}

export {Signaller}
