import React from 'react'
import { render, screen } from '@testing-library/react'
import SigProv from '../index'
import {SignalContext} from '../../../contexts'

// Simple sanity check to make sure our child components render
it("Initializes providers correctly", () => {
    render(<SigProv url="Test" children={<h1>Test</h1>}/>)

    expect(screen.getByText("Test")).toBeInTheDocument()
})

it("Context initializes a signaller", () => {
    render(
        <SigProv url={"test"}>
            <SignalContext.Consumer>
                {(value) => { // Deep check to make sure socket gets init'd correctly
                    expect(value.signaller.socket.url).toEqual('http://localhost/test')
                }}
            </SignalContext.Consumer>
        </SigProv>
    )
})