<template>
    <ItemAdder
        title="Query Parameters"
        :items="item.query"
        @add="addQuery"
        @remove="removeQuery"
        class="dualSelector"
    >
        <template #default="{ item, i }">
            <input
                type="text"
                placeholder="Name"
                :value="item.name"
                @blur="updateQuery('name', $event, i)"
            />
            <input
                type="text"
                placeholder="Value"
                :value="item.value"
                @blur="updateQuery('value', $event, i)"
            />
        </template>
    </ItemAdder>
</template>

<script>
import ItemAdder from '../ItemAdder.vue'

export default {
    components: {
        ItemAdder,
    },
    props: ['item'],
    methods: {
        addQuery() {
            this.$store.commit('addQuery', {
                query: {
                    name: '',
                    value: '',
                },
                uploader: this.item,
            })
        },
        updateQuery(key, event, index) {
            const { value } = event.target

            this.$store.commit('updateQuery', {
                key,
                value,
                index,
                uploader: this.item,
            })
        },
        removeQuery({ index }) {
            this.$store.commit('removeQuery', {
                index,
                uploader: this.item,
            })
        },
    },
}
</script>