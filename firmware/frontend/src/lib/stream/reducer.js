import {CONN_STATE_CHANGE, NEW_VIDEO_SRC, VIDEO_ERR} from "./events"

/* Manage the stream state exposed to the rest of the application.

Actions should be of shape
{
  type: String
  payload: Object
}
 */

// take actions and use them to mutate our state

const reducer = (state, action) => {
  console.log(`${action.type}: ${action.payload}`)
  switch (action.type) {
    case VIDEO_ERR:
      return {...state, streamErr: action.payload}

    case NEW_VIDEO_SRC:
      return {...state, videoSrc: action.payload}

    case CONN_STATE_CHANGE:
      return stateChangeReducer(state, action)
    case 'BEACON_CALLBACK':
      return {...state, beaconCallback: action.payload}
    case 'CONNECT_TO_CALLBACK':
      return {...state, connectTo: action.payload}
    case 'LOCAL_STREAM_CALLBACK':
      return {...state, setLocalStream: action.payload}
    default:
      return state
  }
}

const stateChangeReducer = (state, action) => {
  switch (action.payload) {
    case "disconnected":
      return {...state, videoSrc: null, streamState: action.payload}
    default:
      return {...state, streamState: action.payload}
  }
}

export default reducer