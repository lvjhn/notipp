import ConnectionManager from "./ConnectionManager";
import ReadStateManager from "./ReadStateManager";

export default class MessageReceiver 
{
    static async start() {
        ConnectionManager.addMessageListener(
            async (state, message, serverId, socket) => {
                if(state == "message") {
                   await MessageReceiver.onMessage(serverId, message, socket)
                }
                else if(state == "open") {
                    await MessageReceiver.onOpened(serverId, socket)
                }
                else if(state == "closed") {
                    await MessageReceiver.onClosed(serverId, socket)
                }
                else if(state == "error") {
                    await MessageReceiver.onError(serverId, socket)
                }
            }
        )
    }

    static async onOpened(serverId, socket) {
        
    }

    static async onClosed(serverId, socket) {

    }

    static async onMessage(serverId, message, socket) {
        try {
            const data = JSON.parse(message.data.toString()).details.data
            
            const server = 
                ConnectionManager.store.servers.find(server => server.server.id == serverId)
            
            ReadStateManager.store.unread[serverId] += 1

            console.log("# Data: " + data)

            if(ConnectionManager.store.meta.isEnabled && server["client-state"].status != "DISABLED") {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(
                        data.title  , 
                        data.options
                    )
                })
            }
        } catch(e) {
            if(message.data != "keep:alive") {
                console.error(e)  
            } 
        }
    }

    static onError(serverId, message) {

    }
}