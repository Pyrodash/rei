<template>
    <div class="draggingContainer">
        <div class="header">
            Upload
        </div>
        <div class="form">
            <div class="files">
                <div class="file" v-for="file in files" :key="file.path">
                    {{ file.name }}
                </div>
            </div>
            <div class="field">
                <div class="name">
                    Destination
                </div>
                <div class="value">
                    <select v-model="uploaderId">
                        <option value="0"></option>
                        <option
                            v-for="uploader in uploaders"
                            :value="uploader.id"
                            :key="uploader.id"
                            :selected="uploader.id == uploaderId"
                        >
                            {{ uploader.name || uploader.url }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="buttons">
                <div>
                    <button @click="submit">Submit</button>
                </div>
                <div>
                    <button class="cancel" @click="close">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: ['files'],
    emits: ['close'],
    data() {
        return { uploaderId: null }
    },
    computed: mapState(['uploaders']),
    methods: {
        getFiles() {
            const arr = []

            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i]

                arr.push({ path: file.path })
            }

            return arr
        },
        submit() {
            if (this.uploaderId) {
                window.api.upload(
                    this.getFiles(),
                    this.uploaderId,
                )

                this.close()
            }
        },
        close() {
            this.$emit('close')
        },
    },
    mounted() {
        console.log(this.files)
        console.log(this.uploaderId)
    },
}
</script>

<style scoped>
.draggingContainer {
    flex-direction: column;
}

.header {
    font-size: 1.4em;
    font-weight: bold;
    margin-bottom: 1em;
}

.form {
    width: 35%;
}

.files {
    flex-direction: column;
    margin-bottom: 1.4em;
}
.file {
    background: #fff;
    color: #000;
    border-radius: 25px;
    font-size: 0.8em;
    padding: 0.6em 0.2em;
    width: 100%;
    text-align: center;
}
.file:not(:last-child) {
    margin-bottom: 0.4em;
}

.field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
}
.field .name, .field .value {
    width: 50%
}

.buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.buttons div {
    width: 50%;
    text-align: center;
}

select {
    width: 100%;
    border: 0;
    border-radius: 25px;
    padding: 0.2em
}

button {
    background: transparent;
    border: 0;
    color: #fff;
    font-size: 1.1em;
    padding-bottom: 0.4em;
    border-bottom: 1px solid #fff;
}

button:hover {
    color: #3CD1E5;
    border-color: #3CD1E5;
}

button.cancel:hover {
    color: #E53C3C;
    border-color: #E53C3C;
}
</style>