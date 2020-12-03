import React from 'react'
import styles from './InfoBox.module.scss'

const InfoBox = ({info}) => {
  return <div className={styles.infoBox}>
    <div className={styles.content}>
      <h3>Somethings gone wrong &#x1F61E; </h3>
      <p>{info}</p>
  </div>
  </div>
}

export default InfoBox