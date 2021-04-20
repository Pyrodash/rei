<template>
    <div :class="{ content: true, empty: empty }">
        <span v-if="empty">Fill this up by taking some screenshots</span>
        <Stack
            :column-min-width="110"
            :gutter-width="10"
            :gutter-height="5"
            monitorImagesLoaded
            v-else
        >
            <StackItem v-for="entry in history" :key="entry.src">
                <img :src="entry.src" class="libraryImage" />
            </StackItem>
        </Stack>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { Stack, StackItem } from 'vue-stack-grid'

export default {
    components: {
        Stack,
        StackItem,
    },
    computed: {
        ...mapState(['history']),
        empty() {
            return this.history.length === 0
        },
    },
}
</script>

<style scoped>
.content {
    padding: 2em;
    width: 70%;
    display: flex;
}
.content.empty {
    justify-content: center;
}

.libraryImage {
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.4);
}
</style>