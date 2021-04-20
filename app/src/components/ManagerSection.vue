<template>
    <div class="section">
        <div class="subHeader">
            <div>
                {{ name }}
            </div>
            <div>
                <button
                    class="addButton"
                    @click="$emit('add')"
                >
                    +
                </button>
            </div>
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: ['name'],
}
</script>

<style scoped>
.section {
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
}
</style>