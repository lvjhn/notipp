import { createApp } from 'vue'
import './style.scss'

import https from "https"
import axios from 'axios'
import App from "./App.vue"
import { setupRouter } from './plugins/router.js'
import { setupPinia } from './plugins/pinia.js'
import { useMainStore } from './stores/main.store'
import requestNotificationPermission from './utils/requestNotificationPermission'
import ConnectionManager from './utils/ConnectionManager'
import ReadStateManager from './utils/ReadStateManager'


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

// request permission for notifications 
requestNotificationPermission()

// initialize message counts
ReadStateManager.initialize()

window.showStore = () => {
    console.log(JSON.parse(localStorage.getItem("mainStore")))
}