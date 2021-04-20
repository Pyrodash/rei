import { createStore as createVuexStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

export function createStore({ storage }) {
    const vuexLocal = new VuexPersistence({
        storage,
        saveState(key, state, storage) {
            const stateObj = JSON.parse(JSON.stringify(state))
            const oldState = storage.getItem(key)

            storage.setItem(key, stateObj)
            window.api.updateState(key, stateObj, oldState)
        },
        restoreState(key, storage) {
            return storage.getItem(key)
        },
    })

    return createVuexStore({
        state() {
            return {
                increment: {
                    shortcut: 0,
                    uploader: 0,
                    action: 0,
                    query: 0,
                    header: 0,
                    body: 0,
                },
                shortcuts: [],
                uploaders: [],
                history: [],
            }
        },
        mutations: {
            addShortcut(state, shortcut) {
                shortcut.id = ++state.increment.shortcut
    
                state.shortcuts.push(shortcut)
            },
            addAction(state, { action, shortcut }) {
                action.id = ++state.increment.action
    
                shortcut.actions.push(action)
            },
            updateAction(state, { action, value }) {
                action.value = value
            },
            removeAction(state, { index, shortcut }) {
                shortcut.actions.splice(index, 1)
            },
            updateOption(state, { value, option, action }) {
                action.options[option.key] = value
                console.log(state)
            },
            pushShortcutSequence(state, { key, shortcut }) {
                shortcut.sequence.push(key)
            },
            popShortcutSequence(state, shortcut) {
                shortcut.sequence.pop()
            },
            addUploader(state, uploader) {
                uploader.id = ++state.increment.uploader
                
                state.uploaders.push(uploader)
            },
            updateUploaderName(state, { name, uploader }) {
                uploader.name = name
            },
            updateUploaderURL(state, { url, uploader }) {
                uploader.url = url
            },
            updateFormName(state, { formName, uploader }) {
                uploader.formName = formName
            },
            updateResponseURL(state, { url, uploader }) {
                uploader.responseURL = url
            },
            updateDeletionURL(state, { url, uploader }) {
                uploader.deletionURL = url
            },
            updateErrorMessage(state, { error, uploader }) {
                uploader.errorMessage = error
            },
            addQuery(state, { query, uploader }) {
                query.id = ++state.increment.query
    
                console.log(query.id)
    
                uploader.query.push(query)
            },
            updateQuery(state, { key, value, index, uploader }) {
                uploader.query[index][key] = value
            },
            removeQuery(state, { index, uploader }) {
                uploader.query.splice(index, 1)
            },
            addHeader(state, { header, uploader }) {
                header.id = ++state.increment.header
    
                uploader.headers.push(header)
            },
            updateHeader(state, { key, value, index, uploader }) {
                uploader.headers[index][key] = value
            },
            removeHeader(state, { index, uploader }) {
                uploader.headers.splice(index, 1)
            },
            updateMethod(state, { method, uploader }) {
                uploader.method = method
            },
            updateBodyType(state, { type, uploader }) {
                uploader.body.type = type
    
                switch (type) {
                    case 'application/json':
                    case 'application/x-www-form-urlencoded':
                        uploader.body.value = []
                        break
                    case 'application/xml':
                        uploader.body.value = ''
                        break
                    case null:
                        uploader.body.value = null
                }
            },
            addBodyProp(state, { prop, uploader }) {
                prop.id = ++state.increment.body
    
                uploader.body.value.push(prop)
            },
            updateBodyProp(state, { key, value, index, uploader }) {
                uploader.body.value[index][key] = value
            },
            removeBodyProp(state, { index, uploader }) {
                uploader.body.value.splice(index, 1)
            },
            updateBodyValue(state, { value, uploader }) {
                uploader.body.value = value
            },
            appendHistory(state, entry) {
                state.history.push(entry)
            },
        },
        plugins: [vuexLocal.plugin],
    })    
}
