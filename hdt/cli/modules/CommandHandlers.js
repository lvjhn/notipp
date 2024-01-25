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
import NotificationsViewer from "../../../common/ui/cli/presenters/NotificationsViewer.js";
import Config from "../../core/modules/Config.js";
import Server from "../../core/modules/Server.js";
import Certificates from "../../core/modules/Certificates.js";
import { cwd } from "process";
import path from "path";
import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import axios from "axios";
import { Agent } from "https";

async function makeClientOptions() {
    return {
        httpsAgent: new Agent({
            ca: await GeneralInfo.getCACert()
        }),
        headers: {
            "server-secret" : await GeneralInfo.getServerSecret()
        }
    }
}

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

        process.exit()
    }

    static async handlePair(identifier, options) {
        const hasByIdFlag = options.byId 
        const hasQRFlag = options.qr 
        const hasRegenerateFlag = options.regenerate 
        const hasAllFlag = options.all

        // check if there is a client to pair 
        if(await Clients.countUnpaired() == 0) {
            console.log("@ Nothing to pair. All clients are paired.".bold.grey)
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
            console.log("@ Nothing to unpair. All clients are unpaired.".bold.grey)
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
        
        const portNo = (await Config.getConfig()).server.portNo 
        await axios.post(
            "https://127.0.0.1:" + portNo + "/unpair", 
            {
                id: targetId
            },
            await makeClientOptions()
        ) 

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
            console.log("@ Nothing to remove. No clients found.".bold.grey)
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
        const startDate = options.startDate 
        const modifier = options.modifier 
        const query = options.query ?? "%%"
        const cursor = options.cursor

        await NotificationsViewer.show({
            startDate, 
            modifier,
            query,
            cursor
        }, async (cursor) => {
            return await Notifications.generalSearch({
                jumpToDate: startDate, 
                modifier: modifier, 
                query: query,
                cursor: cursor
            })
        })  

        process.exit()
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
        
    static async handleConfig() {
        console.log(JSON.stringify((await Config.getConfig()).server, null, 4))
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

        await Config.setConfig((config) => set(config["server"], key, value))

        console.log("@ Config set -> " + (key +  " = " + value).italic) 

        process.exit()
    }


    static async handleConfigUnset(options) {
        const key = options.key  

        if(!key) {
            console.log("The `key` options is required.")
            process.exit()
        }

        function unset(item, path, value) {
            let base = item; 
            const pathTokens = path.split(".") 
            for(let i = 0; i < pathTokens.length - 1; i++) {
                const token = pathTokens[i]
                base = base[token]    
            }
                
            if(pathTokens.at(-1) in base) {
                delete base[pathTokens.at(-1)]
            } 
            else {
                console.log("@ Key not set.".gray)
                process.exit()
            }
        }

        await Config.setConfig((item) => unset(item, key))

        console.log("@ Config unset -> " + (key).italic) 

        process.exit()
    }

    static async handleIsEnabled() {
        const result = execSync("sudo systemctl is-enabled notipp-server")
        console.log(result.trim().toString())
        process.exit()
    }

    static async handleEnable() {
        await Server.enable()
        console.log("@ Enabled on startup.".bold.green)
        process.exit()
    }

    static async handleDisable() {
        await Server.disable()
        console.log("@ Disabled on startup.".bold.green)
        process.exit()
    }

    static async handleIsUp() {
        const isUp = await Server.isUp() 
        if(isUp) {
            console.log("YES".bold.green)
        }
        else { 
            console.log("NO".bold.green)
        }
        process.exit()
    }

    static async handleStart() {
        await Server.turnOn()
        console.log("@ Server started.".bold.green)
        process.exit()
    }

    static async handleStop() {
        await Server.turnOff()
        console.log("@ Server stopped.".bold.green)
        process.exit()
    }

    static async handleUpdateCertificates() {
        console.log("@ Updating CA certificates...")
        await Certificates.generateCACertificate()
        console.log("@ Updating SSL certificate...")
        await Certificates.generateServerSSLCertificate()
        console.log("@ Certificates regenerated.".bold)
        process.exit()
    }

    static async handleAutoPair(options) {
        if(options.disable) {
            console.log("@ Auto-pair is now OFF.".bold) 
            process.exit()
        }

        await Config.setConfig((config) => config.server.autoPair = true) 
        console.log("@ Auto-pair is now ON.".bold)
        process.exit()
    }


    static async handleImportCA(options) {
        let keyFile = options.keyFile 
        let certFile = options.certFile 

        if(!keyFile && !certFile) {
            const username = await GeneralInfo.getUsername()
            certFile = process.cwd() + "/" + username + ".notipp.pem"
            keyFile = process.cwd() + "/" + username + ".notipp.key"
        }

        let shouldExit = false;

        if(!await existsSync(keyFile)) {
            console.log("@ Cannot find key file  : " + keyFile.italic.bold)
            shouldExit = true;
        }

        if(!await existsSync(certFile)) {
            console.log("@ Cannot find cert file : " + keyFile.italic.bold)
            shouldExit = true;
        }

        if(shouldExit) {
            console.log("@ Missing files, aborting.".bold)
            process.exit()
        }

        await Certificates.importCA(certFile, keyFile)
        console.log("@ Imported CA files.".bold)
        
        process.exit()
    }

    static async handleEmitNotif(body, options) {
        let otherDetails = options.otherDetails ?? null
        
        if(body == null && otherDetails == null) {
            console.log(
                "@ You must supply details about the notification."
                    .bold.red
            )
            process.exit()
        }

        otherDetails = JSON.parse(otherDetails)

        const data = { 
            title: await GeneralInfo.getHostName(),
            options : {},
            ...otherDetails 
        }

        if(body) {
            data.options.body = body
        }
        else {
          
        }
        
        const portNo = (await Config.getConfig()).server.portNo 
        await axios.post(
            "https://localhost:" + portNo + "/emit/notification", 
            {
                details: data
            },
            await makeClientOptions()            
        )
        
        process.exit()
    }

    static async handleBasePath() {
        console.log(BASE_PATH)
        process.exit()
    }
}  