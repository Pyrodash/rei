const { app } = require('electron')
const { readFile } = require('fs').promises
const { join } = require('path')

const Component = require('./component')
const { exec } = require('../utils')

module.exports = class Capture extends Component {
    constructor(parent) {
        super(parent)        
    }

    async capture({
        path,
        interactive = false,
        sounds = false,
        cropper = false,
        rect,
    }) {
        const isTemp = !path
        const options = []
        const date = new Date()

        if (interactive) {
            options.push('-i')
        }

        if (!sounds) {
            options.push('-x')
        }

        if (rect) {
            options.push(`-R ${rect.x},${rect.y},${rect.width},${rect.height}`)
        }

        if (isTemp) {
            path = join(app.getPath('temp'), app.getName(), `rei-${date.getTime()}.png`)
        }

        options.push(path)

        await exec(`/usr/sbin/screencapture ${options.join(' ')}`)
        
        let body

        try {
            body = await readFile(path)
        } catch (err) {
            console.warn(err)
            return null
        }
        
        let payload = {
            body,
            path,
            date,
            ext: '.png',
            isTemp,
        }

        if (cropper) {
            payload = await this.parent.components.cropper.run(payload)
        }

        return payload
    }
}
