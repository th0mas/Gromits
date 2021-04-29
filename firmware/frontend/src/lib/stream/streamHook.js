// Declare a hook that can be used by multiple react components if needed.
import {useContext, useEffect, useReducer} from 'react'
import {SignalContext} from "../../contexts"
import P2PStream from "./P2PStream"

import {CONN_STATE_CHANGE, NEW_VIDEO_SRC, VIDEO_ERR} from "./events"

import reducer from "./reducer"

const initialState = {
  videoSrc: null,
  streamState: "",
  streamErr: null,
  signalErr: null,
  beaconCallback: null,
  connectTo: null,
  setLocalStream: null
}

const useVideoStream = () => {
  let [state, dispatch] = useReducer(reducer, initialState)
  let {signaller} = useContext(SignalContext)

  // Set our main stream
  useEffect(() => {
    const remoteStreamCallback = (videoSrc) => {
      console.log("Dispatching new video stream!")
      dispatch({
        type: NEW_VIDEO_SRC,
        payload: videoSrc
      })}

    const setErrCallback = (err) => dispatch({
      type: VIDEO_ERR,
      payload: err
    })

    const setConnectionStatusCallback = (status) => dispatch({
      type: CONN_STATE_CHANGE,
      payload: status
    })

    if (signaller) {
      console.log('creating p2p stream!')
      let p2pStream = new P2PStream(signaller, remoteStreamCallback, 
        setConnectionStatusCallback, setErrCallback)

      dispatch({
        type: 'LOCAL_STREAM_CALLBACK',
        payload: (stream) => p2pStream.setLocalStream(stream)
      })

      dispatch({
        type: 'BEACON_CALLBACK',
        payload: () => p2pStream.sendDefaultVideoStreamBeacon()
      })

      dispatch({
        type: 'CONNECT_TO_CALLBACK',
        payload: (client) => {
          console.log(`starting to ${client}`)
          p2pStream.connectToVideo(client)
        }
      })
    }
  }, [signaller])

  return state
}

export default useVideoStream
