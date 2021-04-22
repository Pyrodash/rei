<template>
    <div :class="{ content: true, empty: empty }">
        <div class="header">
            Library
        </div>
        <span v-if="empty">Fill this up by taking some screenshots</span>
        <table v-else>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in history" :key="item.src">
                    <td>{{ basename(item.src) }}</td>
                    <td>{{ formatTime(item.time) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState(['history']),
        empty() {
            return this.history.length === 0
        },
    },
    methods: {
        basename(src) {
            return window.api.basename(src)
        },
        formatTime(time) {
            const date = new Date(time)

            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
    },
}
</script>

<style scoped>
.content {
    padding: 2em;
    width: 70%;
    display: flex;
    flex-direction: column;
}
.content.empty {
    align-items: center;
}

.libraryImage {
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.4);
}

.header {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 0.6em;
    display: flex;
    justify-content: space-between;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
}

th, td {
    padding: 0.6em;
}

td {
    font-size: 0.9em;
    border-bottom: 1px solid rgba(100, 100, 100, 0.1); 
    background: rgba(255, 255, 255, 0.01);
}

tr:nth-child(even) td {
    background: rgba(255, 255, 255, 0.03);
}

th:last-child, td:last-child {
    text-align: right;
}

tbody {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 0;
    border-right: 0;
}
</style>