<template>
    <div class="combination">
        <input
            :value="item.sequence.join('+')"
            v-if="isEditing(item)"
            placeholder="Press some keys"
            :class="{ invalid: invalid }"
            @keydown="onKeyDown"
        />
        <span v-else @dblclick="toggleEditItem(item)">
            {{ item.sequence.join('+') }}
        </span>
    </div>
    <!-- <div v-if="!isActive(shortcut)" class="actionList">
        {{ renderActions(shortcut.actions) }}
    </div> -->
</template>

<script>
import isAccelerator from 'electron-is-accelerator'

const keyMap = {
    Meta: 'Command',
}

export default {
    props: ['item', 'isEditing', 'toggleEditItem'],
    data() {
        return { invalid: false }
    },
    methods: {
        onKeyDown(e) {
            e.preventDefault()
            
            const shortcut = this.item
            let key = e.code.replace(/Key|Digit|Arrow/gi, '')

            if (!e.code.startsWith('Arrow')) {
                key = key.replace(/Left|Right/gi, '')
            }

            if (keyMap[key]) {
                key = keyMap[key]
            }

            if (key === 'Backspace') {
                this.$store.commit('popShortcutSequence', shortcut)
            } else if(!shortcut.sequence.includes(key)) {
                this.$store.commit('pushShortcutSequence', {
                    key,
                    shortcut,
                })
            }

            this.invalid = !isAccelerator(shortcut.sequence.join('+'))
        },
    },
}
</script>

<style scoped>
input.invalid {
    border-color: #DF5050;
}
</style>