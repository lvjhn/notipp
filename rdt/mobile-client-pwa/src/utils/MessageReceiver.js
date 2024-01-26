import ConnectionManager from "./ConnectionManager";

export default class MessageReceiver 
{
    static start() {
        ConnectionManager.addMessageListener(
            (state, message, serverId, socket) => {
                if(state == "message") {
                    MessageReceiver.onMessage(serverId, message, socket)
                }
                else if(state == "open") {
                    MessageReceiver.onOpened(serverId, socket)
                }
                else if(state == "closed") {
                    MessageReceiver.onClosed(serverId, socket)
                }
                else if(state == "error") {
                    MessageReceiver.onError(serverId, socket)
                }
            }
        )
    }

    static onOpened(serverId, socket) {

    }

    static onClosed(serverId, socket) {

    }

    static onMessage(serverId, message, socket) {
        try {
            const data = JSON.parse(message.data.toString()).details.data
            console.log("#Data: " + data)
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(
                    data.title, 
                    data.options
                )
            })
        } catch(e) {
            
        }
    }

    static onError(serverId, message) {

    }
}