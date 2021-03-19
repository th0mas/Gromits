import React, { useState, useEffect } from 'react'
import styles from './SmartData.module.scss'

// The city id for Bristol. Uisng id other name prevents conflict with other cities named Bristol
const city = "2654675"

const getWeatherData = (api, set) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${api}&units=metric`)
        .then(res => res.json())
        .then(data => set(data))
}

const temperature = (data) => {
    if (data == null || data.main == null) {
        return 0
    }
    return data.main.temp
}
 
const SmartData = ({api}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const interval = setInterval(() => {
            getWeatherData(api, setWeather)
            console.log("updating weather")
        }, 20000)
        return () => clearInterval(interval) 
    }, [])

    return <div className={styles.smartData}>
        <p>{temperature(weather)}</p>
        </div>
}

export default SmartData
