const isDev = require('electron-is-dev')
const { join } = require('path')

const DEV_SERVER_URL = process.env.DEV_SERVER_URL

exports.resolveMainFile = function(...args) {
    return join(__dirname, '..', '..', 'dist', 'main', ...args)
}

exports.resolveURL = function(...args) {
    const base = isDev ? DEV_SERVER_URL : `file://${join(__dirname, '..', '..', 'dist', 'renderer')}`
    const url = new URL(args.join('/'), base)

    return url.toString()
}

exports.resolvePage = function(...args) {
    return exports.resolveURL('#', ...args)
}
