/** 
 * CommandHandlers.js 
 * 
 * Description: 
 *  Handle commands for notipp-server. 
 */

import GeneralInfo from "../../core/modules/GeneralInfo.js";
import colors from "colors"
import { table } from "table"
import Clients from "../../core/modules/Clients.js";
import { execSync } from "child_process"
import { BASE_PATH } from "../../../index.js";
import ClientIdentificationPrompt from "../../../common/ui/cli/prompts/ClientIdentificationPrompt.js";
import Database from "../../data/Database.js";
import detectBrowser from "../../../common/helpers/general/detectBrowser.js";
import Queries from "../../core/modules/Queries.js";
import readableDate from "../../../common/helpers/general/readableDate.js";
import Notifications from "../../core/modules/Notifications.js";
import prompts from "prompts";
import e from "express";

export default class CommandHandlers 
{
    static async handleInfo(options) {
        const hasPrivateFlag = options.private; 
        const fullInfo = await GeneralInfo.getFullInfo(); 
        
        const notippInfo = {
            data : [
                ["NOTIPP".bold.cyan, ''], 
                [
                    "VERSION".bold, 
                    await fullInfo.notipp.version
                ], 
                [
                    "USERNAME".bold, 
                    await fullInfo.notipp.username
                ]
            ],
            config: { 
                columns : [
                    { width: 25, wrapWord: true }, 
                    { width: 36, wrapWord: true }
                ],
                spanningCells : [
                    { row: 0, col: 0, colSpan: 2, alignment: "center"  }
                ]
            }
        }

        const serverInfo = {
            data : [
                ["NOTIPP-SERVER".bold.cyan, ''], 
                [
                    "ID".bold, 
                    await fullInfo.server.id
                ], 
                [
                    "HOSTNAME".bold, 
                    await fullInfo.server.hostname 
                ],
                [
                    "IP".bold, 
                    await fullInfo.server.ip 
                ],
                [
                    "PORT".bold, 
                    await fullInfo.server.port 
                ],
                [
                    "OS".bold, 
                    await fullInfo.server.os 
                ],
                [
                    "SSL-CERT-FINGERPINT".bold, 
                    await fullInfo.server["ssl-cert"].fingerprint 
                ],
                [
                    "SSL-CERT-EXPIRATION".bold, 
                    await fullInfo.server["ssl-cert"].expiration 
                ], 
                [
                    "SERVER-SECRET".bold, 
                    hasPrivateFlag ? 
                        await GeneralInfo.getServerSecret() : 
                        "*****************************"

                ]
            ],
            config: { 
                columns : [
                    { width: 25, wrapWord: true }, 
                    { width: 36, wrapWord: true }
                ],
                spanningCells : [
                    { row: 0, col: 0, colSpan: 2, alignment: "center"  }
                ]
            }
        }

        const caCertInfo = {
            data : [
                ["CA-CERT".bold.cyan, ''], 
                [
                    "CA-CERT-FINGERPRINT".bold, 
                    await fullInfo["ca-cert"].fingerprint 
                ],
                [
                    "CA-CERT-EXPIRATION".bold, 
                    await fullInfo["ca-cert"].expiration
                ]
            ],
            config: { 
                columns : [
                    { width: 25, wrapWord: true }, 
                    { width: 36, wrapWord: true }
                ],
                spanningCells : [
                    { row: 0, col: 0, colSpan: 2, alignment: "center"  }
                ]
            }
        }

        console.log(table(notippInfo.data, notippInfo.config))
        console.log(table(serverInfo.data, serverInfo.config))
        console.log(table(caCertInfo.data, caCertInfo.config))

    }

    static async handlePair(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasQRFlag = options.qr 
        const hasRegenerateFlag = options.regenerate 
        const hasAllFlag = options.all

        // check if there is a client to pair 
        if(await Clients.countUnpaired() == 0) {
            console.log("@ Nothing to pair. All clients are paired.")
            process.exit();
            return;
        }

        // handle regenerate flag
        if(hasRegenerateFlag) {
            await Clients.generatePairingSecret()
            if(!hasQRFlag) {
                process.exit()
            }
        }

        // handle qr pairing
        if(hasQRFlag) {
            const qrData = 
                await Clients.generateQRData()
            execSync(
                `qrcode ${JSON.stringify(qrData)} -o ` + 
                `${BASE_PATH}/outputs/pair-qr.png`
            )
            execSync(`display ${BASE_PATH}/outputs/pair-qr.png`)
            process.exit()
        }

        // normalize input (find client id/s)
        let targetId; 
        
        // all clients should be paired
        if(hasAllFlag) {
            await Clients.pairAll() 
            console.log("@ All clients have been paired...".cyan.bold)
            process.exit()
        }

        // input is an id
        else if(hasByIdFlag) {
            targetId = identifier
        }
        // input is a name
        else {
            
            if(identifier) {
                // name check 
                let nameCheck = Database.connection("Clients") 
                nameCheck = nameCheck.where("name", identifier) 
                nameCheck = nameCheck.count("id as count") 
                nameCheck = await nameCheck
                
                if(nameCheck[0].count == 0) {
                    console.log("@ No client with such name.".red) 
                    process.exit()
                }
            }
 
            // choice filtering
            let matchingRecords;

            if(identifier) {
                matchingRecords = Database.connection("Clients");
                matchingRecords = matchingRecords.where("name", identifier) 
                matchingRecords = matchingRecords.where("isPaired", 0)  
                matchingRecords = await matchingRecords;
            } else {
                matchingRecords = Database.connection("Clients");
                matchingRecords = matchingRecords.where("isPaired", 0)  
                matchingRecords = await matchingRecords;
            }

            matchingRecords.sort((a, b) => a.name > b.name ? 1 : -1)

            if(matchingRecords.length == 0) {
                console.log(
                    "@ Cannot find an unpaired client with such name.".red
                )
                console.log(
                    ("@ All clients with such name may already " +
                     "have been paired").grey
                )
                process.exit()
            }

            if(matchingRecords.length == 1) {
                targetId = matchingRecords[0].id
            }
            else {
                targetId = 
                    await ClientIdentificationPrompt.run(
                        "Please select client to pair: ",
                        matchingRecords
                    )
            }
        }

        await Clients.pair(targetId) 
        const name = (await Clients.get(targetId)).name

        console.log(
            ("@ Paired client [" + name + "] " + 
             "with id [" + targetId + "]").cyan.bold
        )
        process.exit()
    }

    static async handleUnpair(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasAllFlag = options.all

        // check if there is a client to pair 
        if(await Clients.countPaired() == 0) {
            console.log("@ Nothing to unpair. All clients are unpaired.")
            process.exit();
            return;
        }

        // normalize input (find client id/s)
        let targetId; 
        
        // all clients should be paired
        if(hasAllFlag) {
            await Clients.unpairAll() 
            console.log("@ All clients have been unpaired...".cyan.bold)
            process.exit()
        }

        // input is an id
        else if(hasByIdFlag) {
            targetId = identifier
        }
        // input is a name
        else {
            
            if(identifier) {
                // name check 
                let nameCheck = Database.connection("Clients") 
                nameCheck = nameCheck.where("name", identifier) 
                nameCheck = nameCheck.count("id as count") 
                nameCheck = await nameCheck
                
                if(nameCheck[0].count == 0) {
                    console.log("@ No client with such name.".red) 
                    process.exit()
                }
            }
 
            // choice filtering
            let matchingRecords;

            if(identifier) {
                matchingRecords = Database.connection("Clients");
                matchingRecords = matchingRecords.where("name", identifier) 
                matchingRecords = matchingRecords.where("isPaired", 1)  
                matchingRecords = await matchingRecords;
            } else {
                matchingRecords = Database.connection("Clients");
                matchingRecords = matchingRecords.where("isPaired", 1)  
                matchingRecords = await matchingRecords;
            }

            matchingRecords.sort((a, b) => a.name > b.name ? 1 : -1)

            if(matchingRecords.length == 0) {
                console.log(
                    "@ Cannot find a paired client with such name.".red
                )
                console.log(
                    ("@ All clients with such name may already " +
                     "have been unpaired").grey
                )
                process.exit()
            }

            if(matchingRecords.length == 1) {
                targetId = matchingRecords[0].id
            }
            else {
                targetId = 
                    await ClientIdentificationPrompt.run(
                        "Please select client to unpair: ",
                        matchingRecords
                    )
            }
        }

        await Clients.unpair(targetId) 
        const name = (await Clients.get(targetId)).name

        console.log(
            ("@ Unpaired client [" + name + "] " + 
             "with id [" + targetId + "]").cyan.bold
        )
        process.exit()
    }

    static async handleRemove(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasAllFlag = options.all

        // check if there is a client to pair 
        if(await Clients.countAll() == 0) {
            console.log("@ Nothing to remove. No clients found.")
            process.exit();
            return;
        }

        // normalize input (find client id/s)
        let targetId; 
        
        // all clients should be paired
        if(hasAllFlag) {
            await Clients.removeAll() 
            console.log("@ All clients have been removed...".cyan.bold)
            process.exit()
        }

        // input is an id
        else if(hasByIdFlag) {
            targetId = identifier
        }

        // input is a name
        else {
            
            if(identifier) {
                // name check 
                let nameCheck = Database.connection("Clients") 
                nameCheck = nameCheck.where("name", identifier) 
                nameCheck = nameCheck.count("id as count") 
                nameCheck = await nameCheck
                
                if(nameCheck[0].count == 0) {
                    console.log("@ No client with such name.".red) 
                    process.exit()
                }
            }
 
            // choice filtering
            let matchingRecords;

            if(identifier) {
                matchingRecords = Database.connection("Clients");
                matchingRecords = matchingRecords.where("name", identifier) 
                matchingRecords = await matchingRecords;
            } else {
                matchingRecords = Database.connection("Clients");
                matchingRecords = await matchingRecords;
            }

            matchingRecords.sort((a, b) => a.name > b.name ? 1 : -1)

            if(matchingRecords.length == 0) {
                console.log(
                    "@ Cannot find a client with such name.".red
                )
                console.log(
                    ("@ All clients with such name may already " +
                     "have been removed").grey
                )
                process.exit()
            }

            if(matchingRecords.length == 1) {
                targetId = matchingRecords[0].id
            }
            else {
                targetId = 
                    await ClientIdentificationPrompt.run(
                        "Please select client to remove: ",
                        matchingRecords
                    )
            }
        }

        const name = (await Clients.get(targetId)).name
        
        await Clients.remove(targetId) 

        console.log(
            ("@ Removed client [" + name + "] " + 
             "with id [" + targetId + "]").cyan.bold
        )
        process.exit()
    }

    static async handleShowClients(options) {
        const hasConnectedFlag = options.connected 
        const hasDisconnectedFlag = options.disconnected 
        const hasPairedFlag = options.paired
        const hasUnpairedFlag = options.unpaired 

        let clients;

        if(hasConnectedFlag) {
            clients = await Clients.getConnected() 
        }
        else if(hasDisconnectedFlag) {
            clients = await Clients.getDisconnected()
        }
        else if(hasPairedFlag) {
            clients = await Clients.getPaired()
        }
        else if(hasUnpairedFlag) {
            clients = await Clients.getUnpaired()
        } 
        else {
            clients = await Clients.getAll()
        }

        if(clients.length == 0) {
            console.log("@ No clients found.".gray.bold)
            process.exit()
        }

        let clientTable = [
            [
                "PAIRED".bold, 
                "CONNECTED".bold, 
                "NAME".bold, 
                "AGENT".bold, 
                "ID".bold
            ]
        ]

        for(let client of clients) {
            clientTable.push([
                client.isPaired ? "YES".green.bold : "NO".red.bold,
                client.isConnected ? "YES".green.bold : "NO".red.bold,
                client.name.bold.blue,
                detectBrowser(client.userAgent), 
                client.id, 
            ])
        }

        console.log(table(clientTable))

        process.exit()
    }

    static async handleShowNotifs(options) {
        const query = options.query ?? "%%"
        const startDate = options.startDate ?? null 
        const modifier = options.modifier ?? "before"

        async function displayForCursor(cursor) {
            const results = 
                await Notifications.generalSearch({
                    jumpToDate: startDate, 
                    modifier: modifier, 
                    query: query,
                    cursor: cursor
                })
                
            if(results.data.length == 0) {
                console.log("@ Reached end of data... exiting.") 
                process.exit()
            }
            
            // create display table 
            const tableData = [
                [
                    "ID".bold, 
                    "MESSAGE".bold,
                    "CREATED-AT".bold
                ]
            ] 

            for(let notification of results.data) {
                const dateFormatted = 
                    readableDate(new Date(notification.createdAt))

                tableData.push([
                    notification.id.toString().bold, 
                    JSON.parse(notification.data).options.body, 
                    dateFormatted.dateString.bold + "\n" + dateFormatted.timeString
                ])
            }

            const tableConfig = {
                columns: [
                    {},
                    { width: 30, wrapWord: true }
                ]
            }

            return { 
                nextCursor: results.meta.next,
                tableData, 
                tableConfig 
            }
        }

        let cursor;
        
        if(modifier == "before") {
            cursor = Infinity;
        } 
        else if(modifier == "after") {
            cursor = 0
        }

        while(true) {
            const next = await displayForCursor(cursor) 
          
            if(modifier == "before" && next.nextCursor > cursor) {
                console.log("@ End of data, exiting.") 
                process.exit()
            } 
            else if(modifier == "after" && next.nextCursor < cursor) {
                console.log("@ End of data, exiting.") 
                process.exit()
            }
            else {
                console.log(table(next.tableData, next.tableConfig))
            }
              
            const continuePage =    
                await prompts({
                    type: "toggle", 
                    name: "value",
                    message: "Show more?", 
                    active: "yes", 
                    inactive: "no",
                    initial: true
                })

            if(continuePage.value) {
                cursor = next.nextCursor
                continue;
            } else {
                process.exit()
            }
        }

    }

    static async handlePruneNotifs(options) {
        const modifier = options.modifier
        const keyDate = options.keyDate 

        if(!keyDate || !modifier) {
            console.log("@ Key date and modifier are required.".bold.red)
            process.exit()
        }

        // get date string
        let targetDate; 
        if(keyDate) {
            const dateTokens = keyDate.split("/").map(x => parseInt(x))
            dateTokens[0] -= 1
            const date = new Date(dateTokens[2], dateTokens[0], dateTokens[1])
            targetDate = date
        }

        // prune notifications 
        await Queries.prune("Notifications", targetDate, {
            modifier: modifier 
        })

        console.log("@ Pruned notifications.".bold.cyan) 
        process.exit()
    }
        
    static async handleConfig(x) {
        
    }

    static async handleConfigSet() {

    }

    static async handleEnable() {

    }

    static async handleDisable() {

    }

    static async handleStart() {

    }

    static async handleStop() {

    }

    static async handleUpdateCertificates() {

    }

    static async handleAutoPair() {

    }

    static async handleAutoPair() {

    }

    static async handleInstallCA() {

    }
}   