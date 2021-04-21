<template>
    <div
        id="appBody"
        @keydown="onKeyDown"
        @dragenter="onDrag"
        @dragover="onDrag"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <div v-if="dragging" id="draggingMessage" class="draggingContainer">
            Drop to upload file
        </div>
        <FileUploader v-if="showUploader" :files="files" @close="hideUploader" />
        <Sidebar v-if="!this.$route.meta.hideSidebar" />
        <router-view id="view" />
    </div>
</template>

<script>
import deepmerge from 'deepmerge'
import Sidebar from './components/Sidebar.vue'
import FileUploader from './components/FileUploader.vue'

export default {
    components: {
        Sidebar,
        FileUploader,
    },
    data() {
        return {
            dragging: false,
            files: null,
            showUploader: false,
        }
    },
    methods: {
        onKeyDown(e) {
            if (e.key === 'Escape' && this.showUploader) {
                this.hideUploader()
            }
        },
        onDrag(e) {
            e.preventDefault()

            this.dragging = true
        },
        onDragLeave(e) {
            if (e.target.id === 'draggingMessage') {
                this.dragging = false
            }
        },
        onDrop(e) {
            this.dragging = false
            const { files } = e.dataTransfer

            if (files.length > 0) {
                this.files = files
                this.showUploader = true
                this.$el.focus()
            }
        },
        hideUploader() {
            this.showUploader = false
            this.files = null
        },
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

#app, #appBody {
    width: 100%;
    height: 100%;
    display: flex;
}

#view {
    overflow-y: auto;
}

.draggingContainer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}

#draggingMessage {
    font-size: 1.5em;
}
</style>