import React, { useState, useEffect } from 'react'
import styles from './SmartData.css'
import {getWeatherData, temperature, getIconUrl} from '../../lib/SmartData'

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
        console.warn("Unable to access weather data")
        return (null)
    } else {
        return <div className="smartData">
            <p className="temperature">{temperature(weather)}°C</p>
            <img className="weather" src={getIconUrl(weather)} alt='Weather Icon'/>
            </div>
    }
}

export default SmartData
