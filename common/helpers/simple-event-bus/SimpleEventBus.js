/** 
 * Bus.js 
 * 
 * Description: 
 *  Simple, interprocess event bus for JavaScript using WebSockets.
 */

import ws, { WebSocket, WebSocketServer } from "ws" 

export default class SimpleEventBus
{
    constructor(ip, port, { onListen = () => {} } = {}) {
        this.subscribers = [] 
        this.port = port
        this.ip = ip
        this.subscription = null; 
        this.server = null;
        this.onListen = onListen
        this.isHosting = false
        this.subscribeFns = []
    }

    host() {
        let self = this 

        this.isHosting = true 

        this.server = new WebSocketServer({
            port: this.port
        })  

        this.server.on("connection", (socket) => {
            console.log("@ SimpleEventBus: New connection detected.")

            self.subscribers.push(socket)

            socket.on("message", (data) => {
                self.broadcast(data)
            })

            socket.on("error", console.error)
           
        })

        this.server.on("error", console.error)

        this.server.on("close", (socket) => {
            self.subscribers.remove(socket)
        })

        this.server.on("listening", () => {
            self.onListen()
        })
    }

    connect(passThrough = false) {
        this.subscription = new WebSocket(`ws://${this.ip}:${this.port}`) 

        this.subscription.on("error", (error) => {
            if(!passThrough) console.error(error)
        })

        this.subscription.on("close", () => {
            
        })

        this.subscription.on("message", (message) => {
            // normalize message
            try {
                message = JSON.parse(message)
            } catch(e) {
                message = message.toString()   
            }

            for(let subscribeFn of this.subscribeFns) {
                subscribeFn(message)
            }
        })

        return;
    }

    subscribe(subscribeFn = () => {}) {
        let self = this
        this.subscribeFns.push(subscribeFn)
    }

    publish(message) {
        if(typeof message == "object") {
            try {
                message = JSON.stringify(message)
            } catch(e) {

            }
        }

        this.subscription.send(message)
    } 

    broadcast(message) {
     
        // broadcast message
        for(let subscriber of this.subscribers) {
            subscriber.send(message)
        }
    }

    close() {
        if(this.subscription) {
            this.subscription.close()
        }
        if(this.server) {
            this.server.close()
        }
    }
}