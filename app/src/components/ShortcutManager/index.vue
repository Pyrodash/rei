<template>
    <TableManager
        :items="shortcuts"
        :canSetEditing="canSetEditing"
        :canToggleActive="canToggleActive"
        ref="manager"
    >
        <template #head="headProps">
            <ShortcutHead v-bind="headProps" />
        </template>
        <template #active="activeProps">
            <ActionEditor v-bind="activeProps" />
        </template>
    </TableManager>
</template>

<script>
import { mapState } from 'vuex'
import TableManager from '../TableManager.vue'
import ActionEditor from './ActionEditor.vue'
import ShortcutHead from './ShortcutHead.vue'

export default {
    components: {
        TableManager,
        ShortcutHead,
        ActionEditor,
    },
    computed: mapState(['shortcuts']),
    methods: {
        setActive(...args) {
            this.$refs.manager.setActive(...args)
        },
        setEditing(...args) {
            this.$refs.manager.setEditing(...args)
        },
        canSetEditing(item, value) {
            return value === true || item.sequence.length > 0
        },
        canToggleActive(item, e) {
            return !e.path[1].classList.contains('combination')
        },
    }
}
</script>