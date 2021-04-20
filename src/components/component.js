module.exports = class Component {
    constructor(parent) {
        this.parent = parent
        this.store = parent.store
    }
}
