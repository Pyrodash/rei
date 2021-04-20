exports.createStorage = (store) => {
    return {
        getItem(key) {
            return store.get(key)
        },
        setItem(key, val) {
            return store.set(key, val)
        },
        removeItem(key) {
            return store.delete(key)
        },
        clear() {
            return store.clear()
        }
    }
}
