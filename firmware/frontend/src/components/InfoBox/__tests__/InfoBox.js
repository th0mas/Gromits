import React from 'react';
import InfoBox from '../index'
import { render, screen } from '@testing-library/react';

it("Renders an error message", () => {
    render(<InfoBox info={"Test"}/>)
    expect(screen.getByText("Test")).toBeInTheDocument()
})