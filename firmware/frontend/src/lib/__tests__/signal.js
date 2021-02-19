import {Signaller} from "../signal"
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'

jest.mock('sockjs-client')

// This would be really useful
const mockStompMethod = jest.fn()

jest.mock('@stomp/stompjs', () => {
  // Works and lets you check for constructor calls:
  return {
    Stomp: {
      over: jest.fn().mockImplementation(() => {
        return {
          send: mockStompMethod,
          connect: mockStompMethod,
          subscribe: mockStompMethod
        }
      })
    }
  }

})

it("should init properly", () => {

  const errCallback = jest.fn()
  let _ = new Signaller("test", errCallback)

  expect(SockJS).toHaveBeenCalled()
})

describe("test class methods", () => {
  const errCallback = jest.fn()
  const s = new Signaller("test", errCallback)

  it("connects properly", () => {
    s.connect()
    expect(mockStompMethod).toHaveBeenCalled()
  })

  it("handles errors", () => {
    s.handle("test")
    expect(errCallback).toBeCalledWith("Signal: test")
  })

  it("registers callbacks", () => {
    let cb = jest.fn()
    s.registerRTCCallback(cb)

    expect(s.callbacks).toHaveLength(1)

    s.removeRTCCallback(cb)
    expect(s.callbacks).toHaveLength(0)
  })

  it("handles connecting properly", () => {
    s.handleConnect()
    expect(mockStompMethod).toHaveBeenCalledTimes(2)
  })

  it("handles signals properly", () => {
    let cb = jest.fn()
    s.registerRTCCallback(cb)

    s.handleSignal({body: `{
      "sender": "not me",
      "msg": "test"
      }`})

    expect(cb).toHaveBeenCalledWith({
      sender: "not me",
      msg: "test"
    })
  })

})