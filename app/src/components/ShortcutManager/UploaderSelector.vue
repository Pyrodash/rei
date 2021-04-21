<template>
    <select @change="onChange">
        <option value="0"></option>
        <option
            v-for="uploader in uploaders"
            :value="uploader.id"
            :key="uploader.id"
            :selected="uploader.id === value"
        >
            {{ uploader.name || uploader.url }}
        </option>
    </select>
</template>

<script>
export default {
    props: ['value', 'option', 'action', 'shortcut'],
    emits: ['update'],
    computed: {
        uploaders() {
            const uploaders = this.$store.state.uploaders
            
            return uploaders.filter((uploader) => !this.uploaderInShortcut(uploader))
        },
    },
    methods: {
        uploaderInShortcut(uploader) {
            if (uploader.id === this.value) {
                return false
            }

            for (const locAction of this.shortcut.actions) {
                if (locAction.value === this.action.value) {
                    if (locAction.options[this.option.key] === uploader.id) {
                        return true
                    }
                }
            }
            
            return false
        },
        onChange(e) {
            const value = Number(e.target.value)

            this.$emit('update', value)
        },
    },
}
</script>