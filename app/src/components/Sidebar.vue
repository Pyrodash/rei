<template>
    <div class="side">
        <div class="header">
            rei.
        </div>
        <Navigation />
    </div>
</template>

<script>
import Navigation from './Navigation.vue'

export default {
    components: {
        Navigation,
    }
}
</script>

<style scoped>
.side {
    padding: 2em;
    display: flex;
    flex-direction: column;
    /* background: rgba(255, 255, 255, 0.05); */
    width: 30%;
}

.header {
    font-weight: bold;
    font-size: 3.2em;
    margin-bottom: 0.2em;
    color: #ABE2F3;
}
</style>
