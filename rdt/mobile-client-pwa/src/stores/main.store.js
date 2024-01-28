import localforage from "localforage";
import { defineStore } from "pinia";
import generateDeviceName from "../../../../common/helpers/general/generateDeviceName.js";
import generateSecret from "../../../../common/helpers/general/generateSecret.js";
import ConnectionManager from "../utils/ConnectionManager.js";
import ReadStateManager from "../utils/ReadStateManager.js";

export const useMainStore = defineStore("mainStore", {
    state: () => ({
        _init: false,
        client: {
            id: crypto.randomUUID(),
            name: generateDeviceName(), 
            secret: generateSecret(), 
            userAgent: navigator.userAgent
        },
        meta: {
            isEnabled: true,
            connectionTimeout: 3000,
            reconnectInterval: 3000,
            keepAliveInterval: 3000
        },
        servers: [
               
        ], 
        unread : {
            
        }
    }), 

    getters: {
        async countUnread() {
            return 5;
        }
    }, 

    actions: {
        init() {
            this._init = true
        },

        setMetaIsEnabled(value) {
            this.meta.isEnabled = value;
        }, 

        async updateServer(serverId, details) {
            const server = 
                await this.servers.find(item => item.server.id == serverId)
            const index = 
                this.servers.indexOf(server)
            if(index == -1) {
                throw Error("Server not found")
            }
            
            this.servers[index] = {
                ...server, 
                ...details
            };
            
            (async () => {
                await ConnectionManager.reconnect(serverId)
            })();
        },

        async addServer(details) {
            this.servers.push(details);

            (async () => {
                await ConnectionManager.connect(details.server.id)
            })();
        },

        async clearServers() {
            this.servers = []
        },

    },

    persist: {
        storage: localStorage
    }
})