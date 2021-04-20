<template>
    <div class="options" v-if="selectedAction && selectedAction.options && selectedAction.options.length > 0">
        <div
            class="option"
            v-for="option in selectedAction.options"
            :key="option.key"
        >
            <div class="name">
                {{ option.name }}
            </div>
            <div class="value">
                <input
                    type="text"
                    :value="action.options[option.key]"
                    @blur="updateOption($event.target.value, option)"
                    v-if="option.type === String"
                />
                <input
                    type="checkbox"
                    :value="action.options[option.key]"
                    @change="updateOption($event.target.checked, option)"
                    v-else-if="option.type === Boolean"
                />
                <PathSelector
                    :value="action.options[option.key]"
                    @update="updateOption($event, option)"
                    v-else-if="option.type === 'path'"
                />
                <UploaderSelector
                    :value="action.options[option.key]"
                    :shortcut="shortcut"
                    :action="action"
                    :option="option"
                    @update="updateOption($event, option)"
                    v-else-if="option.type === 'uploader'"  
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getAction } from '@main/actions'
import PathSelector from '../PathSelector.vue'
import UploaderSelector from './UploaderSelector.vue'

export default {
    components: {
        PathSelector,
        UploaderSelector,
    },
    props: ['action', 'shortcut'],
    computed: {
        selectedAction() {
            return getAction(this.action.value)
        },
    },
    methods: {
        updateOption(value, option) {
            this.$store.commit('updateOption', {
                value,
                option,
                action: this.action,
            })
        },
    },
}
</script>

<style scoped>
.options {
    margin-bottom: 0.4em;
}

.option .name {
    margin-bottom: 0.4em;
}
</style>