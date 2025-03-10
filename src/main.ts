import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from './plugins/fontawesome'

const app = createApp(App)

app.use(router)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
