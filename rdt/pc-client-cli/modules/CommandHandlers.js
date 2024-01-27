/** 
 * CommandHandlers.js 
 * 
 * Description: 
 *  Handle commands for notipp-client. 
 */

import { table } from "table";
import ServerIdentificationPrompt from "../../../common/ui/cli/prompts/ServerIdentificationPrompt.js";
import ConnectionManager from "../../../common/utils/ConnectionManager.js";
import colors from "colors"
import Config from "../../../hdt/core/modules/Config.js";
import NotificationsViewer from "../../../common/ui/cli/presenters/NotificationsViewer.js";
import Clients from "../../../hdt/core/modules/Clients.js";
import { exec, execSync } from "child_process"
import App from "../../common/App.js"
import DataItems from "../../../hdt/data/DataItems.js";



export default class CommandHandlers 
{
    static async handleInfo(options) {
        const hasPrivateFlag = options.private 

        const data = [
            ["CLIENT INFO".bold.cyan, ""],
            ["CLIENT-ID".bold, App.state.client.id], 
            ["CLIENT-NAME".bold, App.state.client.name], 
            ["USER-AGENT".bold, App.state.client.userAgent], 
            ["CLIENT-SECRET".bold,
                hasPrivateFlag ? 
                    App.state.client.secret : 
                    "**************************"
            ]   
        ]

        console.log(
            table(data, {
                columns: [
                    {},
                    { width: 38 }
                ],
                spanningCells: [
                    { row: 0, col: 0, colSpan: 2, alignment: "center" }
                ]
            })
        )

        process.exit()
    }

    static async handleServers(options) {
        const hasOnlineFlag = options.online
        const hasOfflineFlag = options.offline
        const hasUnpairedFlag = options.unpaired
        const hasWithUnreadCountFlag = options.unreadCount


        let servers; 

        if(hasOnlineFlag) {
            servers = App.state.servers.filter(
                server => server.status == "ONLINE"
            )
        }
        else if(hasOfflineFlag) {
            servers = App.state.servers.filter(
                server => server.status == "OFFLINE"
            )
        }
        else if(hasUnpairedFlag) {
            servers = App.state.servers.filter(
                server => server.status == "UNPAIRED"
            )
        }
        else {
            servers = App.state.servers
        }

        if(servers.length == 0) {
            console.log("@ No servers to show.".bold.grey) 
            process.exit()
        }

        if(hasWithUnreadCountFlag) {
            for(let server of servers) {
                const client = 
                    await ConnectionManager.useHttpClient({
                        ip: server.server.ip, 
                        port: server.server.port, 
                        clientId: App.state.client.id, 
                        clientSecret: App.state.client.secret
                    })
                    
                const countUnreadRes =
                    await client.get("/count-unread")

                const countUnread = countUnreadRes.data 

                server.unread = countUnread
            }
        }

        servers.sort((a, b) => a.name > b.name ? 1 : -1)

        function formatStatusText(status) {
            if(status == "ADDED") {
                return status.bold.grey
            }
            else if(status == "ONLINE") {
                return status.bold.cyan
            }
            else if(status == "OFFLINE") {
                return status.bold.red
            }
            else if(status == "UNPAIRED") {
                return status.bold.yellow
            }
            else {
                return status 
            }
        }

        for(let serverData of servers) {
            let tail;

            if(hasWithUnreadCountFlag) {
                tail = `${serverData.unread} new mesages.`.bold.green.italic
            }

            console.log(
                "| " + serverData.server.hostname.bold + " " +
                "(" + formatStatusText(serverData.status) + ")" + 
                (tail ? "-> " + tail : "")
            )
            
            console.log("\t" + "ID        : ".bold + serverData.server.id)
            console.log("\t" + "Username  : ".bold + serverData.notipp.username)
            console.log("\t" + "IP        : ".bold + serverData.server.ip)
            console.log("\t" + "Port      : ".bold + serverData.server.port)
            console.log("\t" + "OS        : ".bold + serverData.server.os)
            console.log("\t" + "CA-FP     : ".bold + serverData["ca-cert"].fingerprint)
            console.log("\t" + "CA-EXP    : ".bold + serverData["ca-cert"].expiration)
        }

        process.exit()
    }   

    static async handleAddServer(options) {
        const ip = options.ip 
        const port = options.port

        const client = 
            await ConnectionManager.useHttpClient({ ip, port }) 

        const response = 
            await client.post("/clients", {
                details: App.state.client,
                extras: {}
            }) 

        if(response.data == "OK" || response.data == "CLIENT_ALREADY_EXISTS") {        
            const info = await client.get("/info") 

            info.data.status = "ONLINE"
            info.data.lastRead = null
            
            const serverExists = 
                App.state.servers.find(
                    item => item.server.id == info.data.server.id
                )

            info.data.server.ip = ip 
            info.data.server.port = port

            if(!serverExists) {
                await App.onAddServer(info.data)
            } else {
                console.log("@ Server already added.".bold.grey)
                process.exit()
            }
            
            console.log("@ Added server.".cyan.bold)
            process.exit()
        }
        else {
            console.log(`Error: ${response.data}`.red)
        }

        process.exit()
    }


    static async handleUpdateServer(identifier, options) {
        let ip = options.ip 
        let port = options.port
        const hasByIdFlag = options.hasByIdFlag

        if(App.state.servers.length == 0) {
            console.log("@ Server list is empty.".bold.grey)
            process.exit()
        }

        App.state.servers.sort(
            (a, b) => a.server.hostname > b.server.hostname ? 1 : -1    
        )

        // determine which server to update
        let targetId; 
    
        if(hasByIdFlag) {
            targetId = identifier 
        }
        else if(identifier) {
            const servers =  
                App.state.servers.filter(
                    (item) => item.server.name == identifier
                )

            if(servers.length == 1) {
                targetId = servers[0].server.id
            } 
            else {
                targetId = await ServerIdentificationPrompt.run(
                    "Select server to update: ", servers
                )
            }
        }
        else if(identifier == null) {
            targetId = await ServerIdentificationPrompt.run(
                "Select server to update: ",    
                App.state.servers
            )
        }

        // update data
        const currentServer = 
            App.state.servers.find((item) => item.server.id == targetId)

        if(currentServer == null) {
            console.log("@ Server not found.".bold.red) 
            process.exit()
        }

        ip   = ip ?? currentServer.server.ip 
        port = port ?? currentServer.server.port

        const client = 
            await ConnectionManager.useHttpClient({ ip, port }) 

        const response = 
            await client.get("/info", {
                details: App.state.client,
                extras: {}
            }) 
        
        const fetchedInfo =  response.data 
        
        if(response.data) {        

        }
        else {
            console.log(`Error: ${response.data}`.red)
            process.exit()
        }

        if(fetchedInfo.server.id != targetId) {
            console.log("@ Server ID mismatch. Aborting".bold.red) 
            process.exit() 
        }

        await App.onUpdateServer(targetId, fetchedInfo)

        console.log("@ Updated server.".bold.cyan)
        process.exit()
    }

    static async handleRemoveServer(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasAllFlag = options.all 

        if(App.state.servers.length == 0) {
            console.log("@ Server list is empty.".bold.grey)
            process.exit()
        }

        if(hasAllFlag) {
            App.state.servers = [] 
            App.saveData() 
            console.log("@ Removed all servers.".bold)
            process.exit()
        }
        
        let targetId; 

        App.state.servers.sort(
            (a, b) => a.server.hostname > b.server.hostname ? 1 : -1    
        )

        if(hasByIdFlag) {
            targetId = identifier 
        }
        else if(identifier) {
            const servers =  
                App.state.servers.filter(
                    (item) => item.server.name == identifier
                )

            if(servers.length == 1) {
                targetId = servers[0].server.id
            } 
            else {
                targetId = await ServerIdentificationPrompt.run(
                    "Select server to remove: ", servers
                )
            }
        }
        else if(identifier == null) {
            targetId = await ServerIdentificationPrompt.run(
                "Select server to remove: ", 
                App.state.servers
            )
        }

        await App.onRemoveServer(targetId)
        
        console.log("@ Removed server.".bold.green)

        process.exit()
    }   

    static async handleConfig(options) {
        console.log(JSON.stringify((await Config.getConfig()).client, null, 4))
        process.exit()
    }

    static async handleConfigSet(options) {
        const key = options.key  
        const value = options.value 

        if(!key || !value) {
            console.log("The `key` and `value` options are required.")
            process.exit()
        }

        function set(item, path, value) {
            let base = item; 
            const pathTokens = path.split(".") 
            for(let i = 0; i < pathTokens.length - 1; i++) {
                const token = pathTokens[i]
                base = base[token]    
            }
            base[pathTokens.at(-1)] = value
        }

        await Config.setConfig((config) => set(config["client"], key, value))

        console.log("@ Config set -> " + (key +  " = " + value).italic) 

        process.exit()
    }

    static async handleTurnOn() {   
        await App.turnOn()
        console.log("@ Enabled alerts.".bold.cyan)
        process.exit()
    }

    static async handleTurnOff() {
        await App.turnOff()
        console.log("@ Disabled alerts.".bold.cyan)
        process.exit()
    }

    static async handleIsOn() { 
        console.log(await App.isOn() ? "enabled" : "disabled")
        process.exit()
    }

    static async handleNotifs(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasMarkAsReadFlag = options.markAsRead

        // get target id of server to visit
        let targetId; 
        
        if(hasByIdFlag) {
            targetId = identifier
        }
        else if(identifier) {
            const servers = 
                App.state.servers.filter(
                    (item) => (
                        item.server.name == identifier && 
                        item.status == "ONLINE"
                    )
                )
        
            for(let server of servers) {
                const client = 
                    await ConnectionManager.useHttpClient({
                        ip: server.server.ip, 
                        port: server.server.port, 
                        clientId: App.state.client.id, 
                        clientSecret: App.state.client.secret
                    })
                    
                const countUnreadRes =
                    await client.get("/count-unread")

                const countUnread = countUnreadRes.data 

                server.unread = countUnread
            }
            
            if(servers.length == 1) {
                targetId = servers[0].server.id
            } 
            else if(servers.length > 1) {
                targetId = await ServerIdentificationPrompt.run(
                    "Select server to remove: ", servers
                )
            }
            else if(servers.length == 0) {
                console.log("@ No connected servers with such name.".bold.red)
            }
        }
        else if(identifier == null) {
            const servers = 
                App.state.servers.filter(item => item.status == "ONLINE")

            
            for(let server of servers) {
                const client = 
                    await ConnectionManager.useHttpClient({
                        ip: server.server.ip, 
                        port: server.server.port, 
                        clientId: App.state.client.id, 
                        clientSecret: App.state.client.secret
                    })
                    
                const countUnreadRes =
                    await client.get("/count-unread")

                const countUnread = countUnreadRes.data 

                server.unread = countUnread
            }

            if(servers.length == 0) {
                console.log("@ No online servers.".bold.grey)
                process.exit()
            }
            else {
                targetId = await ServerIdentificationPrompt.run(
                    `Select a server to ${hasMarkAsReadFlag ? "mark as read" : "view " } notifications from: `, 
                    servers, 
                    (server) =>  
                        server.server.hostname.bold.white +  " " + 
                        ("[Unread: " + server.unread + "]").bold.green
                )
            }
        }

        // get ip and port of server
        const serverData = 
            App.state.servers.find((item) => item.server.id == targetId)

        const { ip, port } = serverData.server

        // show notitifications
        const clientId = App.state.client.id
        const clientSecret = App.state.client.secret

        const client = 
            await ConnectionManager.useHttpClient({ 
                ip, port, clientId, clientSecret
            })
      
        const startDate = options.startDate 
        const modifier = options.modifier ?? "before"
        const query = options.query ?? "%%"
        const cursor = options.cursor

        let hasRead = false;

        await NotificationsViewer.show({
            startDate, 
            modifier,
            query,
            cursor
        }, async (cursor) => {
            const response = 
                await client.get("/notifications", {
                    params: {
                        query, 
                        startDate,
                        modifier,
                        cursor
                    }
                });


            if(!hasRead && hasMarkAsReadFlag) {
                hasRead = true; 
                await client.put("/sync-last-read", {
                    lastRead: response.data.data[0].id
                })
                process.exit()
            }

            return response.data
        })  

        process.exit()
    }

    static async handleClearData() {
        App.eb.publish(["clear:state"])
        console.log("@ Cleared data.".bold.cyan)
        process.exit()
    }

    static async handleChangeName(name) {
        await App.onChangeName(name)
        console.log("@ Changed name.".bold.cyan) 
        process.exit()
    }

    static async handleCountUnread() {
        const servers = App.state.servers; 

        let total = 0;

        for(let server of servers) {
            try {
                const client = 
                    await ConnectionManager.useHttpClient({
                        ip: server.server.ip, 
                        port: server.server.port, 
                        clientId: App.state.client.id, 
                        clientSecret: App.state.client.secret
                    })
                
                const countUnreadRes =
                        await client.get("/count-unread")

                const countUnread = countUnreadRes.data 

                server.unread = countUnread
                total += server.unread 
            } catch(e) {
                server.unread = "<OFFLINE>"
            }
            
        }

        console.log("@ Total Unread: ".bold + total)
        for(let server of servers) {
            if(server.unread == "<OFFLINE>" || server.unread == 0) {
                continue;
            }
            console.log(`\t# ${server.server.hostname.green.bold} : ` + server.unread)
        }

        process.exit()
    }
}   

