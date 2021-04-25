/*
Signaller is an abstraction over communicating with the signalling server itself.

Other parts of the application should only need to use the `send(obj)` method.

This file also defines a random device ID and our message type constants.
 */

import SockJS from 'sockjs-client'
import {Client} from "@stomp/stompjs";
import { hasRole } from './tokenUtils';


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
  setTokenCallback;
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
    this.stompClient.connectHeaders = this.token ? {token: this.token} : {}

    // Register our callbacks
    this.stompClient.onConnect = () => this.handleConnect()
    this.stompClient.onStompError = err => this.handle(err)
    this.stompClient.onWebSocketClose = (err) => this.handleClose(err)
    this.stompClient.onWebSocketError = err => this.handle("WS: " + err)

    // Cleanly disconnect from old socket
    // We need this as we sometimes call `connect` on an already open socket with different tokens/roles.
    // This helps our server recognise our new roles and keeps our state management cleaner.
    this.stompClient.activate()

  }

  disconnect() {
    return this.stompClient.deactivate()
  }

  setToken(token) {
    this.token = token
  }

  setAuthErrCallback(f) {
    this.authErrCallback = f
  }

  setSetTokenCallback(f) {
    this.setTokenCallback = f
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
    // Manually clear any old errors
    this.errCallback('')

    this.registerSubscriptions()

    let payload = {
      type: DEVICE_JOIN
    }

    this.stompClient.publish({
      destination: "/webrtc/join",
      body: JSON.stringify(payload)
    })
  }

  registerSubscriptions() {
    this.stompClient.subscribe('/signal/public', (payload) => this.handleSignal(payload))
    this.stompClient.subscribe('/user/queue/message', (payload) => this.handleDirectMessage(payload))

    // Work around for https://stackoverflow.com/questions/67108426/
    if (hasRole(this.token, "ROLE_VIDEO")) {
      this.stompClient.subscribe('/signal/private', (payload) => this.handleSignal(payload))
    }
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
    // if (content.sender === deviceId) {
    //   console.log("discarding own message")
    //   return
    // }

    this.callbacks.forEach((callback) => callback(content))
  }

  handleDirectMessage(signal) {
    let content = JSON.parse(signal.body)

    if (content.type === "TOKEN") {
      console.log("Received new token, trying to set!")
      this.setTokenCallback(content.token)
    }

  }

  send(obj) {
    let payload = {...obj}
    this.stompClient.publish({
      destination: "/webrtc/signal",
      body: JSON.stringify(payload)
    })

  }


}

export {Signaller}
