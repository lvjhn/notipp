import { createApp } from 'vue'
import './style.scss'

import https from "https"
import axios from 'axios'
import App from "./App.vue"
import { setupRouter } from './plugins/router.js'
import { setupPinia } from './plugins/pinia.js'


// create app 
const app = createApp(App) 

// load vue-router 
app.use(setupRouter())

// load pinia 
app.use(setupPinia())

// mount app
app.mount("#app")