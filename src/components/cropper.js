const { BrowserWindow, screen, ipcMain } = require('electron')
const Component = require('./component')
const { resolveMainFile, resolvePage } = require('../utils')

module.exports = class Cropper extends Component {
    constructor(parent) {
        super(parent)

        this.registerEvents()
    }

    get url() {
        return `file:///${this.payload.path}`
    }

    registerEvents() {    
        ipcMain.handle('get-image', (e) => {
            return this.url
        })

        ipcMain.on('cropper-ready', () => {
            this.window.show()
        })
    }

    createWindow() {
        if (this.window) {
            this.window.close()
        }

        const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
        const { x, y, width, height } = display.bounds
        
        const win = this.window = new BrowserWindow({
            x,
            y,
            width,
            height,
            transparent: true,
            frame: false,
            show: false,
            skipTaskbar: true,
            enableLargerThanScreen: true,
            resizable: false,
            movable: false,
            fullscreenable: false,
            minimizable: false,
            maximizable: false,
            hasShadow: false,
            roundedCorners: false,
            //focusable: false,
            acceptFirstMouse: true,
            //show: false,
            webPreferences: {
                preload: resolveMainFile('preload.js'),
                webSecurity: false,
            },
        })

        win.once('close', () => {
            if (this.window === win) {
                this.window = null
            }
        })

        //win.showInactive()
        //win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        win.setAlwaysOnTop(true, 'screen-saver', 1)
        //win.setIgnoreMouseEvents(true, { forward: true }) // for dev

        win.loadURL(resolvePage('cropper'))
    }

    show(payload) {
        this.payload = payload
        this.createWindow()
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            if (this.handler) {
                ipcMain.off('set-image', this.handler)
                this.handler = null
            }
            
            const handler = () => {
                resolve()
                this.handler = null
            }

            ipcMain.once('set-image', handler)
            
            this.handler = handler
            this.show(payload)
        })
    }
}