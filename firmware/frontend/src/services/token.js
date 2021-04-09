import {useState, useEffect} from 'react'

const useToken = () => {
  let [token, setToken] = useState("")

  const getToken = () => {
    let t = localStorage.getItem('token')

    t && setToken(t)
  }

  useEffect(() => {
    getToken()
  }, [token])

  return [token, setToken]

}

export default useToken


