const { app, globalShortcut, ipcMain } = require('electron')
const { unlink } = require('fs')
const assert = require('assert')

const Component = require('./component')
const { getAction } = require('../actions')

module.exports = class Shortcut extends Component {
    constructor(parent) {
        super(parent)

        this.shortcuts = {}
        this.registerEvents()
    }

    registerEvents() {
        app.once('ready', () => {
            this.registerShortcuts(this.store.get('vuex.shortcuts', []))
        })

        ipcMain.on('update-state', (e, key, newState, oldState) => {
            try {
				assert.deepStrictEqual(newState.shortcuts, oldState.shortcuts);
			} catch {
                this.updateShortcuts(newState.shortcuts)
			}
        })
    }

    registerShortcuts(shortcuts, unregisterLoose = false) {
        const newShortcuts = {}

        for (let shortcut of shortcuts) {
            let hotkey = shortcut.sequence.join('+')
            
            if (newShortcuts[hotkey]) {
                continue
            }

            newShortcuts[hotkey] = shortcut

            if (!this.shortcuts[hotkey]) {
                globalShortcut.register(hotkey, () => this.handle(hotkey)) // todo: error handling + validation for hotkeys
            }
        }
        
        if (unregisterLoose) {
            for (const i in this.shortcuts) {
                if (!newShortcuts[i]) {
                    globalShortcut.unregister(i)
                }
            }
        }

        this.shortcuts = newShortcuts
    }

    updateShortcuts(shortcuts) {
        this.registerShortcuts(shortcuts, true)
    }

    async handle(hotkey) {
        const shortcut = this.shortcuts[hotkey]
        let payload = null

        for (let actionObj of shortcut.actions) {
            const action = getAction(actionObj.value)

            if (action && typeof action.execute === 'function') {
                const lastPayload = payload
                payload = await action.execute(payload, actionObj.options, shortcut, this.parent)

                if (!payload) {
                    // probably cancelled
                    
                    payload = lastPayload // so we can delete the temp file

                    break
                }
            }
        }

        if (payload) {
            if (payload.isTemp) {
                await unlink(payload.path)

                payload.path = null
                payload.isTemp = false
            }

            this.appendHistory(payload)
        }
    }

    appendHistory(payload) {
        // todo: maybe store images in base64 if they're not on disk? simple but need to decide

        if (!payload.path) {
            return
        }

        const src = `file://${payload.path}`
        const entry = {
            src,
            time: payload.date.getTime(),
        }

        const history = this.store.get('vuex.history', [])

        history.push(entry)

        this.store.set('vuex.history', history)
    }
}