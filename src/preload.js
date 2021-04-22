const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')
const { join, basename } = require('path')
const { writeFile } = require('fs').promises
const Store = require('electron-store')
const { createStorage } = require('./storage')

const store = new Store()
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

contextBridge.exposeInMainWorld('storage', createStorage(store))

contextBridge.exposeInMainWorld('api', {
    async capture(data) {
        ipcRenderer.send('capture')

        data = await capture(data)
        console.log(data.payload)
        await writeFile(join(__dirname, '..', 'test.png'), data.payload)
        ipcRenderer.send('captured', data)

        return data
    },
    showPathDialog() {
        return ipcRenderer.invoke('show-path-dialog')
    },
    updateState(key, newState, oldState) {
        return ipcRenderer.send('update-state', key, newState)
    },
    getImage() {
        return ipcRenderer.invoke('get-image')
    },
    upload(files, uploaderId) {
        return ipcRenderer.send('upload', files, uploaderId)
    },
    onSetImage(handler) {
        ipcRenderer.on('set-image', handler)

        return () => ipcRenderer.off('set-image', handler)
    },
    onSetState(handler) {
        ipcRenderer.on('set-state', handler)

        return () => ipcRenderer.off('set-state', handler)
    },
    cropperReady() {
        ipcRenderer.send('cropper-ready')
    },
    basename,
})
