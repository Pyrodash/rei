const isDev = require('electron-is-dev')
const { join, resolve } = require('path')
const { exec } = require('child_process')

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

exports.exec = function(...args) {
    return new Promise((resolve, reject) => {
        exec(...args, (err, stdout) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })
}

exports.constructObjectFromArray = function(arr, key = 'name', val = 'value') {
    const obj = {}

    for (const el of arr) {
        obj[el[key]] = el[val]
    }

    return obj
}
