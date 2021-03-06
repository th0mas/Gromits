import reducer from "../stream/reducer"
import {CONN_STATE_CHANGE, VIDEO_ERR} from "../stream/events"

describe("Reducer", () => {
    it("Sends video error", () => {
        const action = {payload: 'test', type: VIDEO_ERR}
        const result = reducer({}, action)
        expect(result).toStrictEqual({streamErr: 'test'})
    })

    it("handles disconnects", () => {
        const action = {payload: 'disconnected', type: CONN_STATE_CHANGE}
        const result = reducer({}, action)
        expect(result).toStrictEqual({videoSrc: null, streamState: action.payload})
    })

    it("other action type results in just the state", () => {
        const action = {payload: 'test', type: 'test'}
        const result = reducer({msg: 'hello'}, action)
        expect(result).toStrictEqual({msg: 'hello'})
    })
})