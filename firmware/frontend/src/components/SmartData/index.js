import React from 'react'
import styles from './SmartData.module.scss'

// The city id for Bristol. Uisng id other name prevents conflict with other cities named Bristol
const city = "2654675"

const getWeatherData = (api) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${api}`)
        .then(res => res.json())
        .then(data => console.log(data))
}

const temperature = (data) => {
    console.log(data)
    return data.main.temp
}
 
const SmartData = ({api}) => {
    console.log(`key ${api}`)

    getWeatherData(api)

    return <div className={styles.smartData}>
        <p>temp</p>
        </div>
}

export default SmartData
