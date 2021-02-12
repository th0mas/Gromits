// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const mockMedia = {
    getUserMedia: jest.fn().mockImplementation(() =>
        Promise.resolve(
            "stream"
        ))
}

global.navigator.mediaDevices = mockMedia
navigator.mediaDevices.getUserMedia({video:true})
    .then((stream => console.log(stream)))