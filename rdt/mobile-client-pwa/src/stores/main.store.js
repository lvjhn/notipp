import localforage from "localforage";
import { defineStore } from "pinia";
import generateDeviceName from "../../../../common/helpers/general/generateDeviceName.js";
import generateSecret from "../../../../common/helpers/general/generateSecret.js";

export const useMainStore = defineStore("mainStore", {
    state: () => ({
        client: {
            id: crypto.randomUUID(),
            name: generateDeviceName(), 
            secret: generateSecret(), 
            userAgent: navigator.userAgent
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
                    "ip": "192.168.1.53",
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
                "status" : "OFFLINE"
            }, 
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "5b0f2fed-cf73-4be8-9f04-13e85ac65c34",
                    "hostname": "todirep",
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
                "status" : "ONLINE"
            },
            {
                "notipp": {
                    "version": "1.0.0",
                    "username": "johndoe"
                },
                "server": {
                    "id": "5b0f2fed-cf73-4be8-9f04-13e85ac65c34",
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
                "status" : "UNPAIRED"
            }
        ]
    }), 

    getters: {

    }, 

    setters: {

    },

    persist: {
        storage: localforage
    }
})