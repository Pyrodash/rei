<template>
        <div class="nav">
            <div class="item">
                <router-link to="/history">history</router-link>
            </div>
            <div class="item">
                <router-link to="/settings">settings</router-link>
            </div>
        </div>
</template>

<style scoped>
.nav .item {
    color: lightgrey;
    font-size: 1.4em;
    margin-bottom: 0.4em;
}

.nav .item a.router-link-exact-active {
    color: #fff;
}
</style>