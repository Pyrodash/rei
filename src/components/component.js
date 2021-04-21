module.exports = class Component {
    constructor(parent) {
        this.parent = parent
        this.store = parent.store
    }

    /**
     * Send an ipc message to child windows
     * @param {string} channel 
     * @param {*[]} args 
     * @param {WebContents} [ignored]
     */
    send(channel, args, ignored) {
        const { window } = this

        if (window) {
            const children = window.getChildWindows()

            if (window.webContents !== ignored) {
                window.webContents.send(channel, ...args)
            }

            for (const child of children) {
                if (child.webContents !== ignored) {
                    child.webContents.send(channel, ...args)
                }
            }
        }
    }
}
