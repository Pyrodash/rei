<template>
    <div class="items">
        <div
            :class="{
                item: true,
                active: isActive(item)
            }"
            v-for="item in items"
            :key="item.id"
        >
            <div class="head" @click="toggleActiveItem(item, $event)">
                <slot
                    name="head"
                    :item="item"
                    :isEditing="isEditing"
                    :toggleEditItem="toggleEditItem"
                />
            </div>
            <slot
                name="active"
                v-if="isActive(item)"
                :item="item"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: ['items', 'canSetEditing', 'canToggleActive'],
    data() {
        return {
            activeItems: [],
            editingItems: [],
        }
    },
    methods: {
        isActive(item) {
            return this.activeItems.includes(item.id)
        },
        isEditing(item) {
            return this.editingItems.includes(item.id)
        },
        setItem(item, value, target) {
            const { id } = item
            const index = target.indexOf(id)

            if (index > -1 && !value) {
                target.splice(index, 1)
            } else if (index === -1 && value) {
                target.push(item.id)
            }
        },
        setActive(item, value) {
            this.setItem(item, value, this.activeItems)
        },
        setEditing(item, value) {
            if (!this.canSetEditing || this.canSetEditing(item, value)) {
                this.setItem(item, value, this.editingItems)
            }
        },
        getItem(id) {
            return this.items.find((item) => item.id === id)
        },
        toggleActiveItem(item, e) {
            const { id } = item
            const ignored = ['SELECT', 'INPUT', 'BUTTON', 'TEXTAREA'] // ignore clicks on form elxements
            const canToggle = !this.canToggleActive || this.canToggleActive(item, e)

            if (!ignored.includes(e.path[0].tagName) && canToggle) {
                if (this.isEditing(item) && this.canSetEditing(item, false)) {
                    this.toggleEditItem(item)
                } else {
                    const idx = this.activeItems.indexOf(id)
                    
                    if (idx === -1) {
                        this.activeItems.push(item.id)
                    } else {
                        this.activeItems.splice(idx, 1)
                    }
                }
            }
        },
        toggleEditItem(item) {
            const value = !this.isEditing(item)

            this.setEditing(item, value)
        },
    },
    beforeMount() {
        // automatically enable editing for items that should not have it disabled (e.g. blank items)
        for (var i in this.items) {
            const item = this.items[i]

            if (!this.isEditing(item) && !this.canSetEditing(item, false)) {
                this.setEditing(item, true)
            }
        }
    },
}
</script>

<style scoped>
.items {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 0;
    border-right: 0;
    width: 100%;
    flex-grow: 1;
}
.item {
    display: flex;
    font-size: 0.9em;
    padding: 0.6em;
    flex-direction: column;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2); 
}
/* .item:nth-child(even) {
    background: rgba(100, 100, 100, 0.1);
} */
.item .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.item .head ::v-deep(div:first-child) {
    width: 50%;
}
.item .actionList {
    width: 45%;
}
.item:not(:last-child) {
    margin-bottom: 0.2em;  
}

/* .item .head ::v-deep(span:empty::after) {
    content: '\200B';
    visibility: hidden;
} */

.item.active {
    background: rgba(255, 255, 255, 0.03);
}
.item.active .head {
    margin-bottom: 0.8em;
}

::v-deep(select), ::v-deep(input) {
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