import {useState, useEffect} from 'react'

const useToken = () => {
  let [token, setToken] = useState("")

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const updateToken = (token) => {
    if (token !== "INVALID") {
      localStorage.setItem('token', token)
    }
    setToken(token)
  }

  useEffect(() => {
    console.log('you should only see this once')
    let t = getToken()

    t ? setToken(t) : setToken("INVALID")
  }, [])

  return [token, updateToken]

}

export default useToken


