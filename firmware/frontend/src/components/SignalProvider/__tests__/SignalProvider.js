import React from 'react'
import { render, screen } from '@testing-library/react'
import ReactTestUtils from 'react-dom/test-utils'
import SigProv from '../index'
import {SignalContext} from '../../../contexts'

// Simple sanity check to make sure our child components render
it("Initializes providers correctly", () => {
    render(<SigProv url="Test" children={<h1>Test</h1>}/>)

    expect(screen.getByText("Test")).toBeInTheDocument()
})

it("Passes values to children", () => {
    TestRender.create(
        <SigProv url={"val"}>
            <SignalContext.Consumer>
                {(value) => <p>{value}</p>}
            </SignalContext.Consumer>
        </SigProv>
    )
    expect(screen.getByText("fail")).toBeInTheDocument()
})