<template>
    <div class="combination">
        <input
            :value="item.sequence.join('+')"
            v-if="isEditing(item)"
            placeholder="Press some keys"
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
const keyMap = {
    Meta: 'Command',
}

export default {
    props: ['item', 'isEditing', 'toggleEditItem'],
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
        },
    },
}
</script>