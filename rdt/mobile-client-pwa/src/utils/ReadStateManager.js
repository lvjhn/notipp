import axios from "axios";
import { useMainStore } from "../stores/main.store";
import { ref } from "vue";

export default class ReadStateManager 
{
    static connections = {}
    static store = null;
   

    static async makeClient(server) {
        return axios.create({
            baseURL: `https://${server.server.ip}:${server.server.port}/`,
            timeout: 3000,
            headers: {
                "client-id" : 
                    ReadStateManager.store.client.id,
                "client-secret" : 
                    ReadStateManager.store.client.secret
            }
        }) 
    }

    static async initialize() {
        ReadStateManager.store = useMainStore() 

        console.log("@ Initializing connections.")
        const servers = ReadStateManager.store.servers; 


        for(let server of servers) {
            console.log("@ Connecting to " + server.server.id)
            ReadStateManager.getForServer(server)
        }
    }

    static async getForServer(server) {
        const client = await ReadStateManager.makeClient(server)  
        const unread = await client.get("/count-unread") 
        ReadStateManager.store.unread[server.server.id] = 
            parseInt(unread.data)
    }

    static async clearServer(server) {
        delete ReadStateManager.store.unread[server.server.id];
    }

    static async markAllAsRead(server, latestId) {
        const client = await ReadStateManager.makeClient()
        const maxId = parseInt((await client.get("/last-read")).data)
        latestId = Math.max(latestId, maxId)
        await client.put("/sync-last-read", {
            lastRead: latestId
        })
    }

    static countAll() {
        let count = 0 
        for(let item of Object.values(ReadStateManager.store.unread)) {
            count += item; 
        }
        return count;
    }
}

window.ReadStateManager = ReadStateManager