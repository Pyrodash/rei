const { createServer, build } = require('vite')
const { watch } = require('rollup')
const { join } = require('path')
const { server: electronServer } = require('electron-connect')

const viteConfig = require('../vite.config')
const rollupConfig = require('../rollup.config')

const electron = electronServer.create({
    path: join(__dirname, '..'),
})

async function run() {
    const server = await createServer(viteConfig)
    await server.listen()

    const addr = server.httpServer.address()
    const host = addr.address != '::' ? addr.address : '127.0.0.1'

    process.env.DEV_SERVER_URL = `http://${host}:${addr.port}/`

    const watcher = watch(rollupConfig)

    watcher.on('change', (filename) => {
        console.log(`changed ${filename}`)
    })

    watcher.on('event', (evt) => {
        if (evt.code === 'END') {
            if (electron.electronState === 'init') {
                electron.start()
            } else {
                electron.restart()
            }
        } else if (evt.code === 'ERROR') {
            console.log(evt.error)
        }
    })
}

run()