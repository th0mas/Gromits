import {useState, useEffect} from 'react'

const useToken = () => {
  let [token, setToken] = useState("")
  let [tokenLoaded, setTokenLoaded] = useState(false)

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const updateToken = (token) => {
    if (token) {
      localStorage.setItem('token', token)
    }
    setToken(token)
  }

  useEffect(() => {
    console.log('you should only see this once')
    let t = getToken()

    t ? setToken(t) : setToken(null)

    setTokenLoaded(true)
  }, [])

  return [token, updateToken, tokenLoaded]

}

export default useToken


