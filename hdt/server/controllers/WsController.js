/** 
 * WsController.js 
 * 
 * Describes: 
 *  Defines handlers for incoming WebSocket events. 
 */

import Config from "../../core/modules/Config.js";

export default class WsController 
{
    static connections = {} 

    /**
     * Handle incoming connections. 
     */
    static async handleConnection(socket) {
        // handle errors
        socket.on('error', console.error); 

        // receive messages from socket
        socket.on('message', async (message) => {
            try {
                message = JSON.parse(message) 
            } catch(e) {
                message = message.toString()
            }

            await WsController.receiveMessage(message)
        });

        // keep socket alive
        await WsController.keepAlive(socket)
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
    }

    /** 
     * Receive messages. 
     */
    static async receiveMessage(message) {
       
    }
}