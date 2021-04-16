import {useState, useEffect} from 'react'

const useToken = () => {
  let [token, setToken] = useState("")

  const getToken = () => {
    let t = localStorage.getItem('token')

    t && setToken(t)
  }

  const updateToken = (token) => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  useEffect(() => {
    console.log('you should only see this once')
    getToken()
  }, [])

  return [token, updateToken]

}

export default useToken


