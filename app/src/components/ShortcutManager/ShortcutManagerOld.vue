<template>
    <div class="shortcuts">
        <div
            :class="{
                shortcut: true,
                active: isActive(shortcut)
            }"
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            @click="toggleActiveShortcut(shortcut, $event)"
        >
            <div class="head">
                <div class="combination">
                    <input
                        :value="shortcut.sequence.join('+')"
                        v-if="isEditing(shortcut)"
                        placeholder="Press some keys"
                        @keydown="onKeyDown(shortcut, $event)"
                        @keyup="onKeyUp"
                    />
                    <span v-else @dblclick="toggleEditShortcut(shortcut)">
                        {{ shortcut.sequence.join('+') }}
                    </span>
                </div>
                <!-- <div v-if="!isActive(shortcut)" class="actionList">
                    {{ renderActions(shortcut.actions) }}
                </div> -->
            </div>
            <div class="actionEditor" v-if="isActive(shortcut)">
                <div class="title">
                    <b>Actions</b>
                    <button class="addButton" @click="addAction(shortcut)">+</button>
                </div>
                <div class="actions">
                    <span v-if="shortcut.actions.length === 0">No actions added.</span>
                    <div
                        class="action"
                        v-else
                        v-for="(action, i) in shortcut.actions"
                        :key="i"
                    >
                        <ActionSelector
                            :active="action"
                            @update="updateAction(i, $event, shortcut)"
                        />
                        <button class="deleteButton" @click="removeAction(i, shortcut)">&#x2715;</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAction } from '@main/actions'
import ActionSelector from './ActionSelector.vue'

const keyMap = {
    Meta: 'Command',
}

export default {
    components: {
        ActionSelector,
    },
    data() {
        return {
            activeShortcuts: [],
            editingShortcuts: [],
        }
    },
    computed: mapState(['shortcuts']),
    methods: {
        isActive(shortcut) {
            return this.activeShortcuts.includes(shortcut.id)
        },
        isEditing(shortcut) {
            return this.editingShortcuts.includes(shortcut.id)
        },
        setShortcut(shortcut, value, target) {
            const { id } = shortcut
            const index = target.indexOf(id)

            if (index > -1 && !value) {
                target.splice(index, 1)
            } else if (index === -1 && value) {
                target.push(shortcut.id)
            }
        },
        setActive(shortcut, value) {
            this.setShortcut(shortcut, value, this.activeShortcuts)
        },
        setEditing(shortcut, value) {
            if (shortcut.sequence.length === 0 && !value) {
                return
            }

            this.setShortcut(shortcut, value, this.editingShortcuts)
        },
        getShortcut(id) {
            return this.shortcuts.find((shortcut) => shortcut.id === id)
        },
        toggleActiveShortcut(shortcut, e) {
            const { id } = shortcut
            const ignored = ['SELECT', 'INPUT', 'BUTTON'] // ignore clicks on form elements

            if (!ignored.includes(e.path[0].tagName) && !e.path[1].classList.contains('combination')) {
                if (this.isEditing(shortcut)) {
                    this.toggleEditShortcut(shortcut)
                } else {
                    const idx = this.activeShortcuts.indexOf(id)
                    
                    if (idx === -1) {
                        this.activeShortcuts.push(shortcut.id)
                    } else {
                        this.activeShortcuts.splice(idx, 1)
                    }
                }
            }
        },
        toggleEditShortcut(shortcut) {
            const value = !this.isEditing(shortcut)

            this.setEditing(shortcut, value)
        },
        /* onKeyDown(e) {
            e.preventDefault()
        }, */
        onKeyUp(e) {},
        onKeyDown(shortcut, e) {
            e.preventDefault()
            
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
        addAction(shortcut) {
            this.$store.commit('addAction', {
                action: 0,
                shortcut,
            })
        },
        updateAction(index, value, shortcut) {
            console.log({ index, value, shortcut })
            this.$store.commit('updateAction', {
                index,
                value,
                shortcut,
            })
        },
        removeAction(index, shortcut) {
            this.$store.commit('removeAction', {
                index,
                shortcut,
            })
        },
        renderActions(actions) {
            return actions
                .map((action) => getAction(action)?.name || '')
                .filter((action) => action)
                .join(', ')
        },
    },
}
</script>

<style scoped>
.shortcuts {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 0;
    border-right: 0;
    min-height: 60%;
    width: 100%;
}
.shortcut {
    display: flex;
    font-size: 0.9em;
    padding: 0.6em;
    flex-direction: column;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2); 
}
/* .shortcut:nth-child(even) {
    background: rgba(100, 100, 100, 0.1);
} */
.shortcut .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.shortcut .combination/*, .shortcut .actionList*/ {
    width: 50%;
}
.shortcut .actionList {
    width: 45%;
}
.shortcut:not(:last-child) {
    margin-bottom: 0.2em;  
}

.shortcut.active {
    background: rgba(255, 255, 255, 0.03);
}
.shortcut.active .combination {
    margin-bottom: 0.8em;
}
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

select, input {
    background: transparent;
    border: 1px solid lightgrey;
    border-radius: 4px;
    color: #fff;
    padding: 0.4em;
    appearance: none;
    width: 100%;
    outline: none;
}
</style>