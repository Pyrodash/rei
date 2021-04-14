import { createWebHashHistory, createRouter } from 'vue-router'
import Home from './views/Home.vue'
import Capture from './views/Capture.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/capture',
        name: 'Capture',
        component: Capture,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
