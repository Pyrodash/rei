const { Notification, clipboard, ipcMain } = require('electron')
const { createReadStream } = require('fs')
const { render } = require('mustache')
const got = require('got')
const FormData = require('form-data')

const Component = require('./component')
const { constructObjectFromArray, ucfirst } = require('../utils')

module.exports = class Upload extends Component {
    constructor(parent) {
        super(parent)

        this.registerEvents()
    }

    registerEvents() {
        ipcMain.on('upload', (e, files, uploaderId) => {
            this.runWithId(files, uploaderId, 'file')
        })
    }

    async run(payloads, uploader, type = 'screenshot') {
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

                for (var i in body) {
                    formData.append(i, body[i])
                }

                body = formData
                break
            default:
                headers['Content-Type'] = uploader.body.type
        }

        for (let payload of payloads) {
            if (uploader.body.type === 'multipart/form-data') {
                body.append(uploader.formName, createReadStream(payload.path))
            }

            console.log(payload.path)
        }
            
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

        for (let i in payloads) {
            const responseURL = (uploader.responseURL || '').replace('.0', `.${i}`) // set the right index - todo: make this better
            const deletionURL = (uploader.deletionURL || '').replace('.0', `.${i}`)

            let url = payloads[i].url = render(responseURL, args)
            payloads[i].deletionURL = render(deletionURL, args)
            payloads[i].errorMessage = render(uploader.errorMessage || '', args)
            
            let uploaderName = uploader.name || uploader.url

            if (url) {
                clipboard.writeText(url)

                const notif = new Notification({
                    title: `${ucfirst(type)} Uploaded`,
                    body: `Your ${type} has been uploaded to ${uploaderName} and the link was the copied to the clipboard.`
                })

                notif.on('click', () => {
                    shell.openExternal(url)
                })

                notif.show()
            }
        }

        return payloads
    }

    runWithId(payloads, uploaderId, type) {
        const uploader = this.store.get('vuex.uploaders', []).find(
            (uploader) =>
                uploader.id === uploaderId
        )

        return this.run(payloads, uploader, type)
    }
}
