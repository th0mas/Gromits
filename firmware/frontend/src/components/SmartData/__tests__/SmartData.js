import React from 'react';
import SmartData from '../index'
import smartdatalib from '../../../lib/SmartData.js'
import { render, screen } from '@testing-library/react';

jest.mock('../../../lib/SmartData', () => ({
        ...jest.requireActual('../../../lib/SmartData'),
        getWeatherData: async function(api, setWeather) {
            const data = {
                main: {
                    temp: 25
                },
                weather: [{icon: "04d"}]
            }

            setWeather(data)
        }
}))

describe('Renders the individual parts', () => {
    it ("Renders the temperature", async () => {
        const { findByText } = render(<SmartData api={0}/>)
        const div = await findByText(/25/i)
        expect(div)
    })   
})
