import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate" 

/**
 * Make pinia
 */
export function setupPinia () {
    const pinia = createPinia()

    pinia.use(piniaPluginPersistedState)

    return pinia
}

