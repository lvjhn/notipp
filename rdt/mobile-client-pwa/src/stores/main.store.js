import localforage from "localforage";
import { defineStore } from "pinia";
import generateDeviceName from "../../../../common/helpers/general/generateDeviceName.js";
import generateSecret from "../../../../common/helpers/general/generateSecret.js";
import ConnectionManager from "../utils/ConnectionManager.js";

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
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "5b0f2fed-cf73-4be8-9f04-13e85ac65c34",
                    "hostname": "peridot",
                    "ip": "192.168.1.153",
                    "port": 10443,
                    "os": "ubuntu",
                    "ssl-cert": {
                    "expiration": "2034-01-22T17:07:39.000Z",
                    "fingerprint": "84:F0:9F:29:B2:D1:9B:81:93:8C:1B:57:48:AF:8F:AE:4A:34:B9:29"
                }   
                },
                "ca-cert": {
                    "expiration": "2034-01-22T17:07:30.000Z",
                    "fingerprint": "48:3E:13:C9:41:33:DD:25:7A:F7:8C:50:E9:F0:B3:31:DC:82:EB:24"
                },
                "client-state" : {
                    "status" : "UNPAIRED"
                }
            }, 
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "5b0f2fdd-cf73-4be8-9f04-13e85ac65c34",
                    "hostname": "todirep",
                    "ip": "192.168.1.214",
                    "port": 10443,
                    "os": "ubuntu",
                    "ssl-cert": {
                    "expiration": "2034-01-22T17:07:39.000Z",
                    "fingerprint": "84:F0:9F:29:B2:D1:9B:81:93:8C:1B:57:48:AF:8F:AE:4A:34:B9:29"
                }
                },
                "ca-cert": {
                    "expiration": "2034-01-22T17:07:30.000Z",
                    "fingerprint": "48:3E:13:C9:41:33:DD:25:7A:F7:8C:50:E9:F0:B3:31:DC:82:EB:24"
                }, 
                "client-state" : {
                    "status" : "OFFLINE"
                }
            },
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "5g0f2fed-cf73-4be8-9f04-13e85ac65c34",
                    "hostname": "redipto",
                    "ip": "192.168.1.54",
                    "port": 10443,
                    "os": "ubuntu",
                    "ssl-cert": {
                    "expiration": "2034-01-22T17:07:39.000Z",
                    "fingerprint": "84:F0:9F:29:B2:D1:9B:81:93:8C:1B:57:48:AF:8F:AE:4A:34:B9:29"
                }
                },
                "ca-cert": {
                    "expiration": "2034-01-22T17:07:30.000Z",
                    "fingerprint": "48:3E:13:C9:41:33:DD:25:7A:F7:8C:50:E9:F0:B3:31:DC:82:EB:24"
                },
                "client-state" : {
                    "status" : "ONLINE"
                }
            },
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "eb0f2fed-cf73-4be8-9f04-13e85ac65c34",
                    "hostname": "lrpc",
                    "ip": "192.168.1.51",
                    "port": 10443,
                    "os": "ubuntu",
                    "ssl-cert": {
                    "expiration": "2034-01-22T17:07:39.000Z",
                    "fingerprint": "84:F0:9F:29:B2:D1:9B:81:93:8C:1B:57:48:AF:8F:AE:4A:34:B9:29"
                }
                },
                "ca-cert": {
                    "expiration": "2034-01-22T17:07:30.000Z",
                    "fingerprint": "48:3E:13:C9:41:33:DD:25:7A:F7:8C:50:E9:F0:B3:31:DC:82:EB:24"
                },
                "client-state" : {
                    "status" : "DISABLED"
                }
            }
        ]
    }), 

    getters: {

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
            }
            
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
        }
    },

    persist: {
        storage: localStorage
    }
})