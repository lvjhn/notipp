import axios from "axios";
import { useMainStore } from "../stores/main.store";

export default class ConnectionManager 
{
    static connections = {}
    static store = null;
    static listeners = {}
    static unread = {}

    static async initialize() {
        ConnectionManager.store = useMainStore() 

        console.log("@ Initializing connections.")
        const servers = ConnectionManager.store.servers; 

        for(let server of servers) {
            if(server["client-state"].status == "DISABLED") {
                continue;
            } 
            console.log("@ Connecting to " + server.server.id)

            ConnectionManager.connect(server.server.id);
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
        
        let clientName = ConnectionManager.store.client.name;
        let serverName = server.server.hostname; 

        let showDisconnected = true;
        let showUnpaired = true; 
        let showOnline = true;

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

                    navigator.serviceWorker.ready.then((registration) => {
                        registration.showNotification(
                            clientName, 
                            {
                                body: `Connected to '${servername}'`
                            }
                        )
                    })
                } else {
                    server["client-state"].status = "UNPAIRED"

                    if(showUnpaired) {
                        showUnpaired = false; 
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification(
                                clientName, 
                                {
                                    body: `Client must be paired in '${serverName}'`
                                }
                            )
                        })
                    }
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

                    navigator.serviceWorker.ready.then((registration) => {
                        registration.showNotification(
                            clientName, 
                            {
                                body: `'${serverName}' has been disabled.`
                            }
                        )
                    })
                }
                    
                if(message.data == "should:pair") {
                    server["client-state"].status = "UNPAIRED"

                    showDisconnected = false; 
                    showOnline = true;
                
                    if(showUnpaired) {
                        showUnpaired = false; 
                        
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification(
                                clientName, 
                                {
                                    body: `Client must be paired in '${serverName}'`
                                }
                            )
                        })
                    }
                } 

                if(message.data == "keep:alive" ) {
                    showUnpaired = true; 
                    showDisconnected = true;

                    server["client-state"].status = "ONLINE"

                    if(showOnline) {
                        showOnline = false;
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification(
                                clientName, 
                                {
                                    body: `Connected to '${serverName}'`
                                }
                            )
                        })
                    }
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

                    
                    if(showDisconnected) {
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification(
                                clientName, 
                                {
                                    body: `Disconnected from '${serverName}'`
                                }
                            )
                        })
                    }
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