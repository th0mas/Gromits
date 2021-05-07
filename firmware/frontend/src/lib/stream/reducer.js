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
      return {...state, streamState: action.payload}

    default:
      return state
  }
}

export default reducer