<template>
    <div class="content">
        <ManagerSection
            name="Shortcuts"
            class="shortcutManager"
            @add="addShortcut"
        >
            <ShortcutManager ref="shortcutManager" />
        </ManagerSection>
        <ManagerSection name="Uploaders" @add="addUploader">
            <UploaderManager ref="uploaderManager" />
        </ManagerSection>
    </div>
</template>

<script>
import ShortcutManager from '../components/ShortcutManager/index.vue'
import UploaderManager from '../components/UploaderManager/index.vue'
import ManagerSection from '../components/ManagerSection.vue'

export default {
    components: {
        ShortcutManager,
        UploaderManager,
        ManagerSection,
    },
    methods: {
        addShortcut() {
            const { shortcutManager } = this.$refs
            const shortcut = {
                sequence: [],
                actions: [],
            }
            
            this.$store.commit('addShortcut', shortcut)
            shortcutManager.setActive(shortcut, true)
            shortcutManager.setEditing(shortcut, true)
        },
        addUploader() {
            const { uploaderManager } = this.$refs
            const uploader = {
                name: '',
                url: '',
                method: 'GET',
                query: [],
                headers: [],
                body: { type: null, value: null },
                formName: null,
                responseURL: null,
                deletionURL: null,
                errorMessage: null,
            }

            this.$store.commit('addUploader', uploader)
            uploaderManager.setActive(uploader, true)
            uploaderManager.setEditing(uploader, true)
        }
    }
}
</script>

<style scoped>
.content {
    padding: 2em;
    width: 70%;
}

.shortcutManager {
    min-height: 60%;
}

::v-deep(.subHeader) {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 0.6em;
    display: flex;
    justify-content: space-between;
}

::v-deep(.addButton), ::v-deep(.deleteButton) {
    font-size: 1em;
    padding: 0;
    border: 0;
    width: 1.25em;
    background: transparent;
    color: #fff;
    cursor: pointer;
    outline: none;
}
::v-deep(.addButton) {
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}
::v-deep(.deleteButton) {
    color: #DF5050;
}
</style>
