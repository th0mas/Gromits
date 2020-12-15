import React from 'react'
import ReactDOM from 'react-dom'
import Root from '../'

it("Renders without crashing", () => {
  const div = document.createElement('div')
  ReactDOM.render(<Root />, div)
})