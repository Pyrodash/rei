let nativeImage, clipboard, shell, Notification
let writeFile, unlink, createReadStream
let extname, basename, join
let render

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

try {
    const electron = require('electron')
    const fs = require('fs')
    const path = require('path')
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
            await parent.components.upload.runWithId(
                [payload],
                options.uploader,
                'screenshot'
            )

            return payload[0]
        },
    },
]

export function getAction(id) {
    return actions.find((action) => action.id === id)
}
