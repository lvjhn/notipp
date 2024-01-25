import { createRouter, createWebHashHistory } from "vue-router";
import ServersPage from "@/pages/ServersPage.vue" 
import LogsPage from "@/pages/LogsPage.vue" 
import SettingsPage from "@/pages/SettingsPage.vue"

/**
 * Make router
 */
export function setupRouter () {
    const router = createRouter({
        history: createWebHashHistory(), 
        routes: defineRoutes() 
    }) 

    return router
}

/**
 * Define routes for the app
 */
function defineRoutes() {
    return [
        { path: "/", component: ServersPage }, 
        { path: "/logs", component: LogsPage }, 
        { path: "/settings", component: SettingsPage }
    ]
}