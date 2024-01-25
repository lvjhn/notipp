/** 
 * Receiver.js 
 * 
 * Description: 
 *  Receiver class for notipp-client
 */

import { WebSocket } from "ws";
import SimpleEventBus from "../../../common/helpers/simple-event-bus/SimpleEventBus.js";
import Config from "../../../hdt/core/modules/Config.js";
import App from "../../common/App.js";
import https from "https"
import fs from "fs/promises"
import colors from "@colors/colors"
import ConnectionManager from "../../../common/utils/ConnectionManager.js";

export default class Receiver 
{
    /**
     * Properties 
     */
    static eb = null;
    static sockets = {}
    static isChangingName = {}

    /**
     * Methods 
     */
    static async start() {
        await Receiver.makeEventBus()
        await Receiver.initApp()
        await Receiver.initSockets()
    }

    static async makeEventBus() {
        // create event bus
        const ebPort = (await Config.getConfig()).client.eventBusPort;
        const eb = new SimpleEventBus("127.0.0.1", ebPort, {
            onListen: () => {
                console.log("@ Server bus is listening on port no: " + ebPort)
            }
        }) 

        eb.host()

        // listen for messages 
        eb.connect()
        eb.subscribe(async (message) => {
            await Receiver.receive("event-bus", message)
        })

        Receiver.eb = eb
    }

    static async receive(context, message) {
        const event = message[0] 
        const data = message.slice(1,) 

        console.log('@ Received event: ' + event)

        if(event == "add:server") {
            App.state.servers.push(data[0])
            await Receiver.createSocket(targetId)
        }
        else if (event == "update:server") {
            const targetId = data[0]
            const details = data[1]
            const server = App.state.servers.find(
                (item) => item.server.id == targetId
            )
            const index = App.state.servers.indexOf(server) 
            App.state.servers[index] = {
                ...server, 
                ...details
            }
            await Receiver.closeServerSocket(targetId)
            await Receiver.createSocket(targetId)
        }
        else if(event == "remove:server") {
            const targetId = data[0] 
            const server = App.state.servers.find(
                (item) => item.server.id == targetId
            )
            await Receiver.closeServerSocket(targetId)
            const index = App.state.servers.indexOf(server)
            App.state.servers.slice(index, 1)
        }
        else if(event == "change:name") {
            App.state.client.name = data[0]
            console.log(data[1])
            for(let serverId in data[1]) {
                App.state.servers
                   .find((item) => item.server.id == serverId)
                   .mustChangeName = true
            }
            App.saveData()
        }
    }

    static async initApp() {
        await App.init()
    }

    static async initSockets() {
        for(let server of App.state.servers) {
            this.createSocket(server.server.id)
        }
    }

    static async createSocket(serverId) {
        const server = App.state.servers.find(
            (item) => item.server.id == serverId
        )

        const ip = server.server.ip 
        const port = server.server.port 

        const address = `wss://${ip}:${port}/?id=4321&secret=1234`; 

        const agent = new https.Agent({
            ca: (await fs.readFile("./common/ca/hdt-ca.pem")).toString()
        }) 

        let createSocketInt;
        
        async function createSocket() {
            const socket = new WebSocket(address, { agent })

            socket.on("error", (error) => {
                console.error(error)
                clearInterval(createSocketInt)
                clearInterval(socket.refreshInt)
                
                server.status = "OFFLINE"
                App.saveData() 

                reconnect()
            })

            socket.on("open", async () => {
                const keepAliveInterval = 
                    (await Config.getConfig()).client.keepAliveInterval * 1000

                clearInterval(createSocketInt)
                Receiver.sockets[serverId] = socket
                
                server.status = "ONLINE"
                App.saveData() 

                console.log("@ Connected to: " + server.server.hostname.bold)

                socket.refreshInt = setInterval(() => { 
                    socket.send("keep:alive")
                }, keepAliveInterval)
            })

            socket.on("message", async (message) => {
                await Receiver.handleSocketMessage(server, socket, message)
            })

            socket.on("close", async () => {
                // console.log("@ Disconnected...")
                clearInterval(createSocketInt)
                clearInterval(socket.refreshInt)

                server.status = "OFFLINE"
                App.saveData() 

                reconnect()
            })
        }   

        async function reconnect() {
            createSocketInt = setInterval(async () => {
                // console.log("@ Reconnecting...")
                await createSocket()
            }, 3000)
        }

        await reconnect()
    }

    static async closeServerSocket(serverId) {
        const socket = Receiver.sockets[serverId]
        socket.close()
    }

    static async handleSocketMessage(server, socket, message) {
        if(message == "keep:alive") {
            if(server.mustChangeName) {
                if(!(server.server.id in Receiver.isChangingName)) {
                    Receiver.isChangingName[server.server.id] = true 
                    const client = 
                        await ConnectionManager.useHttpClient({
                            ip: server.server.ip, 
                            port: server.server.port,
                            clientId: App.state.client.id,
                            clientSecret: App.state.client.secret
                        })

                    await client.put("/clients/name", {
                        name: App.state.client.name
                    }) 

                    delete Receiver.isChangingName[server.server.id]
                    server.mustChangeName = false
                    Receiver.eb.publish(["changed:name", server])
                }
            }
        }
    }
}