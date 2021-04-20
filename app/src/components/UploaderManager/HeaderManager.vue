<template>
    <ItemAdder
        title="Headers"
        :items="item.headers"
        @add="addHeader"
        @remove="removeHeader"
        class="dualSelector"
    >
        <template #default="{ item, i }">
            <input
                type="text"
                placeholder="Name"
                :value="item.name"
                @blur="updateHeader('name', $event, i)"
            />
            <input
                type="text"
                placeholder="Value"
                :value="item.value"
                @blur="updateHeader('value', $event, i)"
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
       addHeader() {
            this.$store.commit('addHeader', {
                header: {
                    name: '',
                    value: '',
                },
                uploader: this.item,
            })
        },
        updateHeader(key, event, index) {
            const { value } = event.target

            this.$store.commit('updateHeader', {
                key,
                value,
                index,
                uploader: this.item,
            })
        },
        removeHeader({ index }) {
            this.$store.commit('removeHeader', {
                index,
                uploader: this.item,
            })
        },
    },
}
</script>