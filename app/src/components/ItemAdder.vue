<template>
    <div class="title">
        <b>{{ title }}</b>
        <button class="addButton" @click="$emit('add')">+</button>
    </div>
    <div :class="{items: true, ...className}">
        <span v-if="items.length === 0">No {{ title.toLowerCase() }} added.</span>
        <div
            class="item"
            v-else
            v-for="(item, i) in items"
            :key="item.id || i"
        >
            <div class="head">
                <slot :item="item" :i="i" />
                <button
                    class="deleteButton"
                    @click="$emit('remove', { item, index: i })"
                >&#x2715;</button>
            </div>
            <slot name="body" :item="item" :i="i" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'class', 'items'],
    emits: ['add', 'remove'],
    computed: {
        className() {
            return this.class ? { [this.class]: true } : {}
        }
    },
}
</script>

<style scoped>
.title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.4em;
}

.items .item {
    display: flex;
    flex-direction: column;
}
.items .item:not(:last-child) {
    margin-bottom: 0.4em;
}
.items .item .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.items .item .head:not(:last-child) {
    margin-bottom: 0.6em;
}
.items .item ::v-deep(select) {
    width: 90%;
}
</style>