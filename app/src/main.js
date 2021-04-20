import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { createStore } from './store'

const store = createStore({ storage: window.storage })

createApp(App)
    .use(router)
    .use(store)
    .directive('visible', (el, binding) => {
        el.style.visibility = !!binding.value ? 'visible' : 'hidden'
    })
    .mount('#app')
