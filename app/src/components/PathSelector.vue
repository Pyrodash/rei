<template>
    <div class="pathSelector">
        <input type="text" v-model="path" @blur="update" />
        <button @click="browse">Browse</button>
    </div>
</template>

<script>
export default {
    props: ['value'],
    emits: ['update'],
    data() {
        return { path: this.value }
    },
    methods: {
        async browse() {
            const path = await window.api.showPathDialog()

            if (path) {
                this.path = path
                this.update()
            }
        },
        update() {
            this.$emit('update', this.path)
        },
    },
}
</script>

<style scoped>
.pathSelector {
    background: transparent;
    border: 1px solid lightgrey;
    border-radius: 4px;
    color: #fff;
    appearance: none;
    outline: none;
    display: flex;
    overflow: hidden;
}

input {
    border: 0;
}

button {
    background: rgba(0, 0, 0, 0.1);
    color: #fff;
    border: 0;
    border-left: 1px solid grey;
}
</style>