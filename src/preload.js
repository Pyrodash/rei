const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')
const { join } = require('path')
const { writeFile } = require('fs').promises
const dpr = window.devicePixelRatio || 1

function getThumbnailSize() {
    const { width, height } = screen

    return {
        width: width * dpr,
        height: height * dpr,
    }
}

async function capture(data) {
    if (!data.rect) {
        throw new Error('Missing rect')
    }

    if (data.type === 'screenshot') {
        const thumbnailSize = getThumbnailSize()
        const options = { types: ['screen'], thumbnailSize }

        const sources = await desktopCapturer.getSources(options)
        const source = sources.find((source) =>
            source.name.toLowerCase() === 'entire screen'
        )

        data.payload = source.thumbnail.crop(data.rect).toPNG()
        console.log(data.payload)
        return data
    } else if (data.type === 'video') {}
}

contextBridge.exposeInMainWorld('api', {
    async capture(data) {
        ipcRenderer.send('capture')

        data = await capture(data)
        console.log(data.payload)
        await writeFile(join(__dirname, '..', 'test.png'), data.payload)
        ipcRenderer.send('captured', data)

        return data
    }
})
