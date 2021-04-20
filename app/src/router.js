import { createWebHashHistory, createRouter } from 'vue-router'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import Settings from './views/Settings.vue'
import Cropper from './views/Cropper.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        //component: Home,
        redirect: '/library',
    },
    {
        path: '/library',
        name: 'Library',
        component: Library,
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
