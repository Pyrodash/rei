const { app, ipcMain, BrowserWindow, dialog, protocol } = require('electron')

const Component = require('./component')
const { resolvePage, resolveMainFile } = require('../utils')

module.exports = class Main extends Component {
    constructor(parent) {
        super(parent)
        
        this.registerEvents()
    }

    registerEvents() {
        this.store.onDidChange('vuex.history', this.syncState.bind(this))
        this.store.onDidChange('vuex.increment', this.syncState.bind(this))

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

        ipcMain.on('update-state', (e) => {
            this.syncState(e.sender)
        })

        ipcMain.handle('show-path-dialog', async () => {
            const res = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            })

            return res.filePaths[0]
        })
    }

    syncState(ignored) {
        const state = this.store.get('vuex')

        for (const i in this.parent.components) {
            const component = this.parent.components[i]

            component.send('set-state', [state], ignored)
        }
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
                
                app.dock.hide()
            }
        })

        win.loadURL(resolvePage(''))
    }

    show() {
        if (!this.window) {
            this.createWindow()
        } else {
            this.window.show()
        }

        app.dock.show()
    }
}
