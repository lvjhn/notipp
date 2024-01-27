/** 
 * WsController.js 
 * 
 * Describes: 
 *  Defines handlers for incoming WebSocket events. 
 */

import parseQuery from "../../../common/helpers/general/parseQS.js";
import Clients from "../../core/modules/Clients.js";
import Config from "../../core/modules/Config.js";

export default class WsController 
{
    static connections = {} 

    /**
     * Handle incoming connections. 
     */
    static async handleConnection(socket, request) {
        // get credentials
        const query = parseQuery(request.url.substring(2)) 

        const id = query.id 
        const secret = query.secret 

        try {
            await Clients.authorize(id, secret) 
        } catch(e) {
            socket.close() 
        }

        // check if client should pair
        const client = await Clients.get(id) 

        if(client == null) {
            socket.close()
            return
        }

        let count = 0;

        for(let id in WsController.connections) {
            count += WsController.connections[id].length
        }

        console.log("\t> Handling incoming connection (" + count + ")")


        if(client.isPaired == 0) {
            socket.send("should:pair") 
            socket.close()
            console.log("\t> Unpaired client discarded...")
            return
        }

        console.log("\t> Client connected...")

        // add to connections list 
        if(!(id in WsController.connections)) {
            WsController.connections[id] = [] 
        }
        
        WsController.connections[id].push(socket)

        // handle errors
        socket.on('error', console.error); 

        // receive messages from socket
        socket.on('message', async (message) => {
            try {
                message = JSON.parse(message) 
            } catch(e) {
                message = message.toString()
            }

            await WsController.receiveMessage(socket, message)
        });

        // on close 
        socket.on("close", async (socket) => {
            const index = WsController.connections[id].indexOf(socket)
            WsController.connections[id].splice(index, 1)
            clearInterval(kai)
            if(WsController.connections[id].length == 0) {
                delete WsController.connections[id]
            }
            console.log("\t> Client disconnected...")
        })

        // keep socket alive
        const kai = await WsController.keepAlive(socket)
    }

    /** 
     * Keep alive.
     */
    static async keepAlive(socket) {
        let keepAliveInterval = 
            (await Config.getConfig())
                .server
                .keepAliveInterval 

        keepAliveInterval *= 1000

        setInterval(
            () => {
                socket.send("keep:alive")
            }, 
            keepAliveInterval
        )
        return keepAliveInterval
    }

    /** 
     * Receive messages. 
     */
    static async receiveMessage(socket, message) {
        console.log("Received message: " + message)
       
    }
}