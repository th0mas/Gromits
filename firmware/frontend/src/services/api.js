import {useContext, useEffect, useState } from 'react'
import { TokenContext } from '../contexts'
import url from './url'

const createHeaders = (token) => {
  let tokenHeader = token ? {'Authorization': 'Bearer ' + token} : {}
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...tokenHeader
  }
}

const useResource = (query, ...params) => {
  const [data, setData]           = useState(null);
  const [error, setError]         = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  const [token] = useContext(TokenContext);

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(url + query, {
          headers: createHeaders(token)
        })

        if (res.status >= 200 && res.status < 300) {
          const json = await res.json()
          setData(json)
          setIsLoading(false)
          setError(null)
        } else {
          throw new Error("Status code: " + res.status)
        }

        
      } catch (err) {
        setIsLoading(false)
        setError(err)
      }
    }

    fetchApi() // eslint-disable-line

  }, [query, token])

  return {data, error, isLoading}

}

export const post = (resource, payload, token) => {
  let reqUrl = `${url}${resource}/`
  return fetch(reqUrl, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(payload)
  }).then(
    (response => response.json())
  )
}

export const get = (resource, token) => {
  let reqUrl = `${url}${resource}/`
  return fetch(reqUrl, {
    method: 'GET',
    headers: createHeaders(token)
  }).then(
    r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        throw new Error("Status code:" + r.status)
      }
    }
  )
}

export default useResource