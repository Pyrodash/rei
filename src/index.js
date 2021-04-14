const { app } = require('electron')
const path = require('path')

const CaptureComponent = require('./components/capture')

class App {
    constructor() {
        this.components = {
            captureComponent: new CaptureComponent(this)
        }
    }
}

module.exports = new App()
