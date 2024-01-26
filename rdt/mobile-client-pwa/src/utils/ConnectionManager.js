import axios from "axios";
import { useMainStore } from "../stores/main.store";

export default class ConnectionManager 
{
    static connections = {}
    static store = null;
    static listeners = {}

    static async initialize() {
        ConnectionManager.store = useMainStore() 

        console.log("@ Initializing connections.")
        const servers = ConnectionManager.store.servers; 

        for(let server of servers) {
            if(server["client-state"].status == "DISABLED") {
                continue;
            } 
            console.log("@ Connecting to " + server.server.id)
            ConnectionManager.connect(server.server.id)    
        }
    }

    static async connect(serverId) {
        console.log("@ Connecting to server [" + serverId + "]")
        const server = 
            ConnectionManager.store.servers.find((item) => (
                item.server.id == serverId  
            ));

        if(server["client-state"].status == "DISABLED") {
            return
        }

        const ip = server.server.ip 
        const port = server.server.port
        const id = server.server.id 

        
        const qs = "?" + 
            `id=${ConnectionManager.store.client.id}&` + 
            `secret=${ConnectionManager.store.client.secret}`

        const address = `wss://${ip}:${port}/${qs}`
        
        console.log(`@ Attempting to connect to ${address} -> ${id}`)

        let socket;
        let socketTimeout;
        let keepAliveInt;
        let hasOpened = false;
        
        async function createSocket() {

            socket = new WebSocket(address)

            socket.onopen = async () => {
                hasOpened = true;
                clearTimeout(socketTimeout)
                console.log(`@ ${address} : Opened.`)

                console.log(server["client-state"].status)

                ConnectionManager.connections[serverId] = socket;

                const client = axios.create({
                    baseURL: `https://${ip}:${port}/`,
                    timeout: 3000,
                    headers: {
                        "client-id" : 
                            ConnectionManager.store.client.id,
                        "client-secret" : 
                            ConnectionManager.store.client.secret
                    }
                })
                
                if((await client.get("/is-paired")).data == "OK") {
                    server["client-state"].status = "ONLINE"
                } else {
                    server["client-state"].status = "UNPAIRED"
                }

                /**
                 * Keep alive. 
                 */
                const keepAliveInterval = 
                ConnectionManager.store.meta.keepAliveInterval

                keepAliveInt = 
                    setInterval(
                        () => {
                            socket && socket.send("keep:alive")
                        }, 
                        keepAliveInterval
                    )

                for(let listener in ConnectionManager.listeners) {
                    const listenerFn = ConnectionManager.listeners[listener] 
                    listenerFn("open", null, serverId, socket)
                }
            }

            socket.onmessage = (message) => {
                console.log(
                    `@ ${address} : Received message -> ` + 
                    message.data.toString()
                ) 

                if(server["client-state"].status == "DISABLED") {
                    socket && socket.close()
                }
                    
                if(message.data == "should:pair") {
                    server["client-state"].status = "UNPAIRED"
                } 

                if(message.data == "keep:alive" ) {
                    server["client-state"].status = "ONLINE"
                } 

                for(let listener in ConnectionManager.listeners) {
                    const listenerFn = ConnectionManager.listeners[listener] 
                    listenerFn("message", message, serverId, socket)
                }

            }

            socket.onclose = () => {
                hasOpened = false
                console.log(`@ ${address} : Closed.`)
                

                clearInterval(keepAliveInt)
                
                if(server["client-state"].status != "UNPAIRED" && 
                   server["client-state"].status != "DISABLED") {
                    server["client-state"].status = "OFFLINE"
                }

                keepAliveInt && clearInterval(keepAliveInt)

                socketTimeout = setTimeout(async () => {
                    if(server["client-state"].status == "DISABLED") {
                        clearTimeout(socketTimeout)
                        return;
                    }
                    socketTimeout && clearTimeout(socketTimeout)
                    socket && !hasOpened && socket.close()
                    socket = await createSocket()
                }, 3000)

                for(let listener in ConnectionManager.listeners) {
                    const listenerFn = ConnectionManager.listeners[listener] 
                    listenerFn("close", null, serverId, socket)
                }
            }
            
            socket.onerror = (error) => {
                keepAliveInt && clearInterval(keepAliveInt)
                console.error(error)

                if(server["client-state"].status != "DISABLED") {
                    server["client-state"].status = "OFFLINE"
                }

                for(let listener in ConnectionManager.listeners) {
                    const listenerFn = ConnectionManager.listeners[listener] 
                    listenerFn("error", null, serverId, socket)
                }
            }

            return socket
        }

        socket = await createSocket()   

    }

    static async disconnect(serverId) {
        console.log("@ Disconnecting from server [" + serverId + "]")
        ConnectionManager.connections[serverId].close()
    }

    static async reconnect(serverId) {
        ConnectionManager.disconnect(serverId) 
        ConnectionManager.connect(serverId)
    }

    static async addMessageListener(listener) {
        ConnectionManager.listeners[listener] = listener
    }

    static async removeMessageListener(listener) {
        delete ConnectionManager.listeners[listener]
    }
}

window.ConnectionManager = ConnectionManager