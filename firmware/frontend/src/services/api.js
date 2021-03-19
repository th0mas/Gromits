import {useEffect, useState } from 'react'
import useToken from "./token";
import url from './url'

const useResource = (query, ...params) => {
  const [data, setData]           = useState(null);
  const [error, setError]         = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  const [token] = useToken();

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(url + query, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })

        const json = await res.json()
        setData(json)
        setIsLoading(false)
      } catch (err) {
        setError(err)
      }
    }

    fetchApi()

  }, [query, token])

  return {data, error, isLoading}

}