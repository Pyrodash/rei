import { createWebHashHistory, createRouter } from 'vue-router'
import Home from './views/Home.vue'
import History from './views/History.vue'
import Settings from './views/Settings.vue'
import Cropper from './views/Cropper.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        //component: Home,
        redirect: '/history',
    },
    {
        path: '/history',
        name: 'History',
        component: History,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/cropper',
        name: 'Cropper',
        component: Cropper,
        meta: { hideSidebar: true },
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
