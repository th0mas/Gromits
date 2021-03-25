import React from 'react'
import useResource from "../../services/api";

const Admin = () => {
  let {data, error, isLoading} = useResource("setup_status")

  if (isLoading) {return <h2>Loading...</h2>}

  if (error) {return <h2>Error loading: {error.toString()}</h2>}

  return (
    <>
      <h1>Setup this Gromit.</h1>
    </>
  )
}

export default Admin