/*
Signaller is an abstraction over communicating with the signalling server itself.

Other parts of the application should only need to use the `send(obj)` method.

 */

import SockJS from 'sockjs-client'
import {Client, IFrame} from "@stomp/stompjs";
import { clientId, hasRole } from './tokenUtils';
import { Signal } from './stream/P2PStream'


export const DEVICE_JOIN = 'DEVICE_JOIN'
export const DEVICE_LEAVE = 'DEVICE_LEAVE'
export const VIDEO_OFFER = 'VIDEO_OFFER'
export const VIDEO_ANSWER = 'VIDEO_ANSWER'
export const NEW_ICE_CANDIDATE = 'NEW_ICE_CANDIDATE'

export enum Channel { 
  Private,
  User
} 

class Signaller {
  // Define stubs for vars to be set later.
  stompClient
  errCallback
  authErrCallback: () => void
  setTokenCallback: (t: string) => void;
  onConnect?: () => void 
  token?: string
  clientId?: string

  callbacks: Array<(a: any) => void> = []
  userCallbacks: Array<(a: any) => void> = []


  // Creates our socket and stompJs clients
  constructor(url: string, errCallback: (e: string) => void, authErrCallback: () => void, setTokenCallback: (t: string) => void,
    onConnect: () => void | undefined
  ) {
    this.errCallback = errCallback
    this.authErrCallback = authErrCallback
    this.setTokenCallback = setTokenCallback
    this.onConnect = onConnect
      
    this.stompClient = new Client()
    // @ts-ignore
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

  setToken(token: string) {
    this.token = token
    this.clientId = clientId(token)
  }

  // Abstract away our error handler a bit
  handle(frame: IFrame | String) {
    this.errCallback(`Signal: ${frame}`)

    if (this.isIFrame(frame)) {
      if (frame.headers.message.includes("Access is denied") || frame.headers.message.includes("SignatureException")) {
        console.log("attempting auth callback...")
        this.authErrCallback()
      }
    }
  }

  // Allow other classes to register callbacks
  registerRTCCallback(callback: (a: any) => void, channel?: Channel) {
    if (channel === Channel.Private || !channel)  {
      this.callbacks.push(callback)
    } else if (channel === Channel.User) {
      this.userCallbacks.push(callback)
    }
  }

  // Remove our callbacks - perf optimisation when using Hooks
  removeRTCCallback(callback: (a: any) => void) {
    this.callbacks = this.callbacks.filter(item => item != callback)
    this.userCallbacks = this.userCallbacks.filter(item => item != callback)
  }

  // internal method to handle our initial connection and subscribe to needed channels
  handleConnect() {
    // Manually clear any old errors
    this.errCallback('')

    this.registerSubscriptions()

    // let payload = {
    //   type: DEVICE_JOIN
    // }

    // this.stompClient.publish({
    //   destination: "/webrtc/join",
    //   body: JSON.stringify(payload)
    // })

    if (this.onConnect) {
      this.onConnect()
    }
  }

  registerSubscriptions() {
    this.stompClient.subscribe('/msg/public', (payload) => this.handleSignal(payload))
    this.stompClient.subscribe('/user/queue/message', (payload) => this.handleDirectMessage(payload))

    // Work around for https://stackoverflow.com/questions/67108426/
    if (hasRole(this.token, "ROLE_VIDEO")) {
      this.stompClient.subscribe('/msg/private', (payload) => this.handleSignal(payload))
    }
  }

  // Render a nice error for closed connections
  handleClose(err: CloseEvent) {
    if (err.code === 1002) {
      this.handle("Connection to server lost")
      
    } else {
      this.handle(err.reason)
    }
  }

  // Relay our signals to all listening clients.
  //  - might not be needed in the end but worth buulding
  //    out now
  handleSignal(signal: any) {
    let content = JSON.parse(signal.body)
    if (content.sender === this.clientId) {
      console.log("discarding own message")
      return
    }

    this.callbacks.forEach((callback) => callback(content))
  }

  handleDirectMessage(signal: any) {
    let content = JSON.parse(signal.body)

    if (content.type === "TOKEN") {
      console.log("Received new token, trying to set!")
      this.setTokenCallback(content.token)
      return
    }


    this.userCallbacks.forEach((callback) => callback(content))
  }

  send(obj: Object, to?: string) {
    let payload = {...obj, to}
    this.stompClient.publish({
      destination: "/webrtc/signal",
      body: JSON.stringify(payload),
    })

  }

  private isIFrame(object: any): object is IFrame {
    return (object as IFrame).headers !== undefined
  }


}

export {Signaller}
