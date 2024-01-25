import localforage from "localforage";
import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
    state: () => ({

    }), 

    getters: {

    }, 

    setters: {

    },

    persist: {
        storage: localforage
    }
})