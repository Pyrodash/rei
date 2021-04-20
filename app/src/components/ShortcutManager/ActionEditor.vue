<template>
    <div class="actionEditor">
        <div class="actions">
            <ItemAdder
                title="Actions"
                :items="item.actions"
                @add="addAction"
                @remove="removeAction"
            >
                <template #default="{ item: action }">
                    <ActionSelector
                        :active="action"
                        :shortcut="item"
                        @update="updateAction(action, $event)"
                    />
                </template>
                <template #body="{ item: action }">
                    <OptionManager :action="action" :shortcut="item" />
                </template>
            </ItemAdder>
        </div>
    </div>
</template>

<script>
import ItemAdder from '../ItemAdder.vue'
import ActionSelector from './ActionSelector.vue'
import OptionManager from './OptionManager.vue'

export default {
    components: {
        ActionSelector,
        ItemAdder,
        OptionManager,
    },
    props: ['item'],
    methods: {
        addAction() {
            this.$store.commit('addAction', {
                action: {
                    value: 0,
                    options: {},
                },
                shortcut: this.item,
            })
        },
        updateAction(action, value) {
            console.log({ action, value })
            this.$store.commit('updateAction', {
                action,
                value,
            })
        },
        removeAction({ index }) {
            this.$store.commit('removeAction', {
                index,
                shortcut: this.item,
            })
        },
    },
}
</script>

<style scoped>
.actionEditor {
    width: 100%;
}
.actionEditor .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.4em;
}
.actions .action:not(:last-child) {
    margin-bottom: 0.4em;
}
.actions .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.actions .action ::v-deep(select) {
    width: 90%;
}
</style>