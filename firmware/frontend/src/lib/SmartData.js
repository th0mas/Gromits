// The city id for Bristol. Uisng id other name prevents conflict with other cities named Bristol
const city = "2654675"

const getWeatherData = async (api, set) => {
        await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${api}&units=metric`)
        .then(res => res.json())
        .then(data => set(data))
}

const getIconUrl = (data) => {
    return `https://openweathermap.org/img/wn/${icon(data)}@2x.png`
}

const temperature = (data) => {
    return data.main.temp.toFixed(1)
}

const icon = (data) => {
    if (typeof data.weather != 'undefined') {
        return data.weather[0].icon
    }
}
 
export {getWeatherData, temperature, getIconUrl}
