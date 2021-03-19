// Declare a hook that can be used by multiple react components if needed.
import {useState, useContext, useEffect, useReducer} from 'react'
import {SignalContext} from "../../contexts"
import P2PStream from "./P2PStream"

import {CONN_STATE_CHANGE, NEW_VIDEO_SRC, VIDEO_ERR} from "./events"

import reducer from "./reducer"

const initialState = {
  videoSrc: null,
  streamState: "",
  streamErr: null,
  signalErr: null
}

const useVideoStream = () => {
  let [state, dispatch] = useReducer(reducer, initialState)
  let {signaller} = useContext(SignalContext)

  useEffect(() => {
    let p2pStream = new P2PStream(signaller, (err) => dispatch({
      type: VIDEO_ERR,
      payload: err
    }))

    p2pStream.open((videoSrc) => dispatch({
      type: NEW_VIDEO_SRC,
      payload: videoSrc
    }))

    p2pStream.setConnectionStatusCallback((status) => dispatch({
      type: CONN_STATE_CHANGE,
      payload: status
    }))
  }, [signaller])

  return state // TODO: Refactor sigErr into state
}

export default useVideoStream