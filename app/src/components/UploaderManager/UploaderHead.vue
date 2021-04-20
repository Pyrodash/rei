<template>
    <div class="name">
        <input
            :value="item.name"
            v-if="isEditing(item)"
            placeholder="Enter a name"
            @blur="updateName"
        />
        <span v-else @dblclick="toggleEditItem(item)">
            {{ item.name || item.url }}
        </span>
    </div>
</template>

<script>
export default {
    props: ['item', 'isEditing', 'toggleEditItem'],
    methods: {
        updateName(e) {
            this.$store.commit('updateUploaderName', {
                name: e.target.value,
                uploader: this.item,
            })
        }
    },
}
</script>