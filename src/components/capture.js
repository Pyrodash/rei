const { app, screen, ipcMain, BrowserWindow, globalShortcut } = require('electron')
const { writeFile } = require('fs').promises
const { join } = require('path')

const Component = require('./component')
const { resolvePage, resolveMainFile } = require('../utils')

module.exports = class Capture extends Component {
    constructor(parent) {
        super(parent)
        
        this.registerEvents()
    }

    registerEvents() {
        app.once('ready', () => {
            globalShortcut.register('CommandOrControl+Option+4', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow()
                }
            })
        })

        app.on('window-all-closed', (e) => {
            e.preventDefault()
        })

        ipcMain.on('capture', () => {
            //this.window.setOpacity(0)
        })

        ipcMain.on('captured', async (e, data) => {
            //this.window.close()
        })

        app.dock.hide()
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
            webPreferences: {
                preload: resolveMainFile('preload.js')
            },
        })

        win.once('close', () => {
            if (this.window === win) {
                this.window = null
            }
        })

        win.showInactive()
        win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        win.setAlwaysOnTop(true, 'screen-saver', 1)
        //win.setIgnoreMouseEvents(true, { forward: true }) // for dev

        win.loadURL(resolvePage('capture'))
    }
}
