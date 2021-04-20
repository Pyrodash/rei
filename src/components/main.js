const { app, ipcMain, BrowserWindow, dialog, protocol } = require('electron')

const Component = require('./component')
const { resolvePage, resolveMainFile } = require('../utils')

module.exports = class Main extends Component {
    constructor(parent) {
        super(parent)
        
        this.registerEvents()
    }

    registerEvents() {
        app.on('window-all-closed', (e) => {
            e.preventDefault()
        })

        app.on('ready', () => {
            // allow loading file:// urls
            protocol.registerFileProtocol('file', (request, callback) => {
                const pathname = decodeURIComponent(request.url.replace('file:///', ''))
                callback(pathname)
            })

            this.createWindow()
        })

        ipcMain.handle('show-path-dialog', async () => {
            const res = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            })

            return res.filePaths[0]
        })
    }

    createWindow() {
        if (this.window) {
            return
        }

        const win = this.window = new BrowserWindow({
            width: 700,
            height: 500,
            titleBarStyle: 'hiddenInset',
            vibrancy: 'window',
            show: false,
            webPreferences: {
                webSecurity: false,
                preload: resolveMainFile('preload.js')
            },
        })

        win.once('ready-to-show', () => {
            win.show()
        })

        win.once('close', () => {
            if (this.window === win) {
                this.window = null
            }
        })

        win.loadURL(resolvePage(''))
    }
}
