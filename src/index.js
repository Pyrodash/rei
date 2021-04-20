const Store = require('electron-store')
const { app } = require('electron')
const { mkdirSync } = require('fs')
const { join } = require('path')

const MainComponent = require('./components/main')
const CropperComponent = require('./components/cropper')
const CaptureComponent = require('./components/capture')
const ShortcutComponent = require('./components/shortcut')

mkdirSync(join(app.getPath('temp'), app.getName()), { recursive: true })

class App {
    constructor() {
        this.store = new Store({ watch: true })
        this.components = {
            main: new MainComponent(this),
            cropper: new CropperComponent(this),
            capture: new CaptureComponent(this),
            shortcut: new ShortcutComponent(this),
        }
    }
}

module.exports = new App()
