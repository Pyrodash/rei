<template>
    <Sidebar v-if="!this.$route.meta.hideSidebar" />
    <router-view id="view" />
</template>

<script>
import deepmerge from 'deepmerge'
import Sidebar from './components/Sidebar.vue'

export default {
    components: {
        Sidebar,
    },
    mounted() {
        this.unsubscribe = window.api.onSetState((e, state) => {
            this.$store.replaceState(
                deepmerge(
                    this.$store.state,
                    state || {},
                    {
                        arrayMerge: (destArray, sourceArray, options) => sourceArray
                    },
                )
            )
        })
    },
    unmounted() {
        this.unsubscribe()
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,800&display=swap');
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700,800&display=swap');

html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}

* {
    box-sizing: border-box;
}

a {
    color: inherit;
    text-decoration: inherit;
}

:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
}
input, button, textarea, :focus {
    outline: none;
}

a:not([draggable=true]), img:not([draggable=true]) {
    -webkit-user-drag: none;
    user-drag: none; /* Technically not supported in Electron yet */
}
a[href^="http://"],
a[href^="https://"],
a[href^="ftp://"] {
    -webkit-user-drag: auto;
    user-drag: auto; /* Technically not supported in Electron yet */
}

body {
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Source Sans Pro',
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
}

#app {
    width: 100%;
    height: 100%;
    display: flex;
}

#view {
    overflow-y: auto;
}
</style>