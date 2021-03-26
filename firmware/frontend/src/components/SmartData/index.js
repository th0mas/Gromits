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
    return data.main.temp.toFixed(1)
}

const icon = (data) => {
    return data.weather[0].icon
}
 
const SmartData = ({api}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        getWeatherData(api, setWeather)
        const interval = setInterval(() => {
            getWeatherData(api, setWeather)
            console.log("updating weather")
        }, 20000)
        return () => clearInterval(interval) 
    }, [api])

    if (api == null) {
        console.warn("No api key provided, smart data will not be avaliable")
        return (null)
    }

    if (weather == null || weather.main == null) {
        console.error("Unable to access weather data")
        return (null)
    } else {
        return <div className={styles.smartData}>
            <p>{temperature(weather)}°C</p>
            <img src={`http://openweathermap.org/img/wn/${icon(weather)}@2x.png`} alt='Weather Icon'/>
            </div>
    }
}

export default SmartData
