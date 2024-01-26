import { createApp } from 'vue'
import './style.scss'

import https from "https"
import axios from 'axios'
import App from "./App.vue"
import { setupRouter } from './plugins/router.js'
import { setupPinia } from './plugins/pinia.js'
import { useMainStore } from './stores/main.store'


// create app 
const app = createApp(App) 

// load vue-router 
app.use(setupRouter())

// load pinia 
app.use(setupPinia())

// initialize app's store
useMainStore().init()

// mount app
app.mount("#app")