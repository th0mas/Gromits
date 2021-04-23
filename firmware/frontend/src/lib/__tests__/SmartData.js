import {getIconUrl, temperature, getWeatherData} from "../SmartData"

const data = {
    main: {
        temp: 25
    },
    weather: [{icon: "04d"}]
}



describe('Data filtering functions', () => {
    it ("Gets the correct icon from the weather data", () => {
        expect(getIconUrl(data)).toBe("http://openweathermap.org/img/wn/04d@2x.png")
    })

    it ("Gets the correct temperature from the weather data", () => {
        expect(temperature(data)).toBe("25.0")
    })
})

describe('api function', () => {
    it ("Correctly fetches data from the api", async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve(data),
            })
        )
        let fromApi
        await getWeatherData(null, x => fromApi = x)
        expect(fromApi).toBe(data)
    })
})

