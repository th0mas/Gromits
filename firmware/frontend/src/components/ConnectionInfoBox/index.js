import React from 'react'
import styles from './ConnectionInfoBox.module.scss'

const ConnectionInfoBox = ({info}) => {
  return <div className={styles.connectionInfoBox}>
    <div className={styles.content}>
      <h3>Connection Status: ; </h3>
      <p>{info}</p>
  </div>
  </div>
}

export default ConnectionInfoBox