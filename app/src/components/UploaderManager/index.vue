<template>
    <TableManager
        :items="uploaders"
        :canSetEditing="canSetEditing"
        :canToggleActive="canToggleActive"
        ref="manager"
    >
        <template #head="headProps">
            <UploaderHead v-bind="headProps" />
        </template>
        <template #active="activeProps">
            <UploaderEditor v-bind="activeProps" />
        </template>
    </TableManager>
</template>

<script>
import { mapState } from 'vuex'
import TableManager from '../TableManager.vue'
import UploaderEditor from './UploaderEditor.vue'
import UploaderHead from './UploaderHead.vue'

export default {
    components: {
        TableManager,
        UploaderHead,
        UploaderEditor,
    },
    computed: mapState(['uploaders']),
    methods: {
        setActive(...args) {
            this.$refs.manager.setActive(...args)
        },
        setEditing(...args) {
            this.$refs.manager.setEditing(...args)
        },
        canSetEditing(item, value) {
            return value === true || item.name.length > 0
        },
        canToggleActive(item, e) {
            return !e.path[1].classList.contains('name')
        },
    }
}
</script>