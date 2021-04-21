let nativeImage, clipboard, shell, Notification
let writeFile, unlink, createReadStream
let extname, basename, join
let constructObjectFromArray
let got
let FormData
let render

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

try {
    const electron = require('electron')
    const fs = require('fs')
    const path = require('path')
    got = require('got')
    FormData = require('form-data')
    const mustache = require('mustache')

    nativeImage = electron.nativeImage
    clipboard = electron.clipboard
    shell = electron.shell
    Notification = electron.Notification

    writeFile = fs.promises.writeFile
    unlink = fs.promises.unlink
    createReadStream = fs.createReadStream

    extname = path.extname
    basename = path.basename
    join = path.join

    constructObjectFromArray = require('./utils').constructObjectFromArray

    mustache.escape = (text) => text
    render = mustache.render
} catch (err) {
    console.warn(err)
}

const getDestination = (payload, destination, shortcut, parent) => {
    const increments = parent.store.get('vuex.increment.shortcuts')
    const id = (increments[shortcut.id] || 0) + 1

    increments[shortcut.id] = id
    parent.store.set('vuex.increment.shortcuts', increments)
    
    const day = payload.date.getDate()
    const dayStr = day.toString()
    const dayName = dayNames[payload.date.getDay()]

    const month = payload.date.getMonth() + 1
    const monthStr = month.toString()
    const monthName = monthNames[month - 1]

    const year = payload.date.getFullYear()
    const yearStr = year.toString()

    const template = {
        i: id.toString(),
        d: dayStr,
        dd: dayStr.padStart('2', '0'),
        m: monthStr,
        mm: monthStr.padStart('2', '0'),
        y: yearStr,
        yy: yearStr,
        month: monthName,
        mon: monthName.substr(0, 3),
        day: dayName,
        shortDay: dayName.substr(0, 3),
    }

    let targetPath = render(destination, template)

    if (targetPath !== destination) {
        if (!extname(targetPath)) {
            targetPath += payload.ext
        }
    }

    if (!extname(targetPath)) {
        targetPath = join(targetPath, basename(payload.path))
    }

    return targetPath
}

export const actions = [
    {
        id: 1,
        name: 'Capture Entire Screen',
        execute(payload, options, shortcut, parent) {
            const captureComponent = parent.components.capture

            return captureComponent.capture({
                interactive: false,
                sounds: true,
            })
        },
    },
    {
        id: 2,
        name: 'Capture a Region',
        execute(payload, options, shortcut, parent) {
            const captureComponent = parent.components.capture

            return captureComponent.capture({
                interactive: true,
                //cropper: true,
                sounds: true,
            })
        },
    },
    {
        id: 3,
        name: 'Save to Disk',
        options: [
            {
                name: 'Destination',
                key: 'destination',
                type: 'path',
            },
        ],
        async execute(payload, options, shortcut, parent) {
            const { destination } = options
            const path = getDestination(payload, destination, shortcut, parent)
            
            await writeFile(path, payload.body)

            if (payload.isTemp) {
                await unlink(payload.path)
    
                payload.path = path
                payload.isTemp = false
            }

            console.log(payload.path)

            return payload
        },
    },
    {
        id: 4,
        name: 'Copy to Clipboard',
        execute(payload, options, shortcut, parent) {
            const image = nativeImage.createFromBuffer(payload.body)
            clipboard.writeImage(image)
            
            return payload
        },
    },
    {
        id: 5,
        name: 'Upload',
        allowMultiple: true,
        options: [
            {
                name: 'Uploader',
                key: 'uploader',
                type: 'uploader',
            }
        ],
        async execute(payload, options, shortcut, parent) {
            const uploaderId = options.uploader
            const uploader = parent.store.get('vuex.uploaders', []).find(
                (uploader) =>
                    uploader.id === uploaderId
            )

            const query = constructObjectFromArray(uploader.query)
            const headers = constructObjectFromArray(uploader.headers)

            let body = uploader.body.value
            let json
            let form

            if (Array.isArray(body)) {
                body = constructObjectFromArray(body)
            }

            switch (uploader.body.type) {
                case 'application/json':
                    json = body
                    body = null
                    break
                case 'application/x-www-form-urlencoded':
                    form  = body
                    body = null
                    break
                case 'multipart/form-data':
                    let formData = new FormData()

                    formData.append(uploader.formName, createReadStream(payload.path))

                    for (var i in body) {
                        formData.append(i, body[i])
                    }

                    body = formData
                    break
                default:
                    headers['Content-Type'] = uploader.body.type
            }

            console.log(payload.path)
            
            const res = await got(uploader.url, {
                method: uploader.method,
                searchParams: query,
                headers,
                body,
                json,
                form,
            })

            const reqUrl = res.req.url
            const resHeaders = res.headers
            let resJSON

            try {
                resJSON = JSON.parse(res.body)
            } catch (err) {
                resJSON = {}
            }
            
            const args = {
                headers: resHeaders,
                json: resJSON,
                url: reqUrl,
            }

            payload.url = render(uploader.responseURL || '', args)
            payload.deletionURL = render(uploader.deletionURL || '', args)
            payload.errorMessage = render(uploader.errorMessage || '', args)

            console.log(payload)
            
            const uploaderName = uploader.name || uploader.url

            if (payload.url) {
                clipboard.writeText(payload.url)

                const notif = new Notification({
                    title: 'Screenshot Uploaded',
                    body: `Your screenshot has been uploaded to ${uploaderName} and the link was the copied to the clipboard.`
                })

                notif.on('click', () => {
                    shell.openExternal(payload.url)
                })

                notif.show()
            }

            return payload
        },
    },
]

export function getAction(id) {
    return actions.find((action) => action.id === id)
}
