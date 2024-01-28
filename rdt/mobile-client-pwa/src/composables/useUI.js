import { computed, ref, shallowRef } from "vue"
import { useRouter } from "vue-router"
import { useMainStore } from "../stores/main.store";

const router = useRouter()

export const currentPage = ref("Servers");

function determineIndex() {
    const indices = ["Servers", "Logs", "Settings"]
    return indices.indexOf(currentPage.value)
}

export const navigationRowIndex = computed(() => determineIndex())

export const useUI = () => {
    const store = useMainStore()

    return {
        currentServer: ref(store.servers[0])
    }    
}