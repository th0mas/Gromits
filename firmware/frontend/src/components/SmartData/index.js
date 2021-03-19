import React from 'react'
import styles from './SmartData.module.scss'

const SmartData = ({api}) => {
    console.log(`key ${api}`)
    return <div className={styles.smartData}>
        <p>TEXT</p>
        </div>
}

export default SmartData
