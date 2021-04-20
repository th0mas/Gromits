import {getIconUrl, temperature} from "../SmartData.js"

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
})
