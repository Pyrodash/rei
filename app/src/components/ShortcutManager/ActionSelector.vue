<template>
    <select @change="onChange">
        <option value="0"></option>
        <option
            v-for="action in actions"
            :value="action.id"
            :key="action.id"
            :selected="action.id === this.selected"
        >
            {{ action.name }}
        </option>
    </select>
</template>

<script>
import { actions } from '@main/actions'

const actionInShortcut = (action, shortcut, ignored) => {
    if (action.id === ignored.value) {
        return false
    }

    for (const locAction of shortcut.actions) {
        if (locAction.value === action.id) {
            return true
        }
    }
    
    return false
}

export default {
    props: ['active', 'shortcut'],
    emits: ['update'],
    data() {
        return { selected: this.active.value }
    },
    computed: {
        actions() {
            return actions.filter((action) => action.allowMultiple || !actionInShortcut(action, this.shortcut, this.active))
        },
    },
    methods: {
        onChange(e) {
            const value = Number(e.target.value)
            this.selected = value

            this.$emit('update', value)
        },
    },
}
</script>