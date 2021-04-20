<template>
    <ItemAdder
        title="Body"
        :items="item.body.value"
        @add="addBodyProp"
        @remove="removeBodyProp"
        class="dualSelector"
    >
        <template #default="{ item, i }">
            <input
                type="text"
                placeholder="Name"
                :value="item.name"
                @blur="updateBodyProp('name', $event, i)"
            />
            <input
                type="text"
                placeholder="Value"
                :value="item.value"
                @blur="updateBodyProp('value', $event, i)"
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
        addBodyProp() {
            this.$store.commit('addBodyProp', {
                prop: {
                    name: '',
                    value: '',
                },
                uploader: this.item,
            })
        },
        updateBodyProp(key, event, index) {
            const { value } = event.target

            this.$store.commit('updateBodyProp', {
                key,
                value,
                index,
                uploader: this.item,
            })
        },
        removeBodyProp({ index }) {
            this.$store.commit('removeBodyProp', {
                index,
                uploader: this.item,
            })
        },
    },
}
</script>