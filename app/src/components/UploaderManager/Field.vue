<template>
    <div class="field">
        <div class="name">
            {{ label }}
        </div>
        <div class="value">
            <slot>
                <input
                    :type="type || 'text'"
                    :value="name ? item[name] : undefined"
                    @blur="$emit('blur', $event)"
                />
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['item', 'name', 'label', 'type'],
}
</script>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
}
.field:not(:last-child) {
    margin-bottom: 0.6em;
}
.field .name {
    margin-bottom: 0.4em;
}
</style>