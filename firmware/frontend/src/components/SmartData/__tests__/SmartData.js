import React from 'react';
import SmartData from '../index'
import smartdatalib from '../../../lib/SmartData.js'
import { render, screen } from '@testing-library/react';

jest.mock('../../../lib/SmartData', () => ({
        ...jest.requireActual('../../../lib/SmartData'),
        getWeatherData: function(api, setWeather) {
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
    it ("Renders the temperature", () => {
        
    })   
})
