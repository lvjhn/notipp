/**
 * App.js 
 * 
 * Description: 
 *  Centralized file for app. 
 */

import generateDeviceName from "../../common/helpers/general/generateDeviceName.js";
import generateSecret from "../../common/helpers/general/generateSecret.js";
import SimpleEventBus from "../../common/helpers/simple-event-bus/SimpleEventBus.js";
import ConnectionManager from "../../common/utils/ConnectionManager.js";
import Config from "../../hdt/core/modules/Config.js";
import DataItems from "../../hdt/data/DataItems.js";
import { BASE_PATH } from "../../index.js";
import fs from "fs/promises"



export default class App 
{
    static SWITCH_PATH = BASE_PATH + "/rdt/receiver/switch" 
    static eb = false; 
    static manualSave = true;

    static state = null;

    static storage;

    static async initState() {
        App.state = {
            client: {
                id: crypto.randomUUID(), 
                name: generateDeviceName(), 
                secret: generateSecret(), 
                userAgent: "notipp-cli"
            }, 
            servers : [] 
        }
    }

    static async init() {
        await App.initState() 
        
        const portNo = (await Config.getConfig()).client.eventBusPort

        App.eb = new SimpleEventBus("127.0.0.1", portNo)

        try {
            App.eb.connect(true)
        } catch(e) {
            console.log("@ Warning: Cannot connect to event bus.")
        }

        // receive events 
        App.eb.subscribe((event) => {

            if(event[0] == "changed:name") {
                App.state.servers 
                   .find((item) => item.server.id == event[1].server.id)
                   .mustChangeName = false
                App.saveData()
            }

            else if(event[0] == "should:pair") {
                App.state.servers 
                   .find((item) => item.server.id == event[1].server.id)
                   .status = "UNPAIRED" 
                App.saveData()
            }
        })

        // load data
        await App.loadData()
    }

    static async saveData() {
        if(App.manualSave) {
            await DataItems.setItem(
                "HOST-CLIENT-STATE", JSON.stringify(App.state, null, 4)
            )
        }
    }

    static async loadData() {
        if(!App.storage) {
            App.storage = DataItems
        }

        if(!await DataItems.hasItem("HOST-CLIENT-STATE")) {
            await App.saveData()
        }

        App.state = JSON.parse(await App.storage.getItem("HOST-CLIENT-STATE"))
    }

    static async turnOn() {
        fs.writeFile(App.SWITCH_PATH, "ON:" + (new Date()).getTime())
    }   

    static async turnOff() {
        fs.writeFile(App.SWITCH_PATH, "OFF:" + (new Date()).getTime())
    }

    static async isOn() {
        const state = 
            (await fs.readFile(App.SWITCH_PATH)).toString() 
        const stateStr = 
            state.split(":")[0] == "ON" ? true : false
        return stateStr
    }

    static async onAddServer(details) {
        App.state.servers.push(details) 
        
        await App.saveData();

        App.eb && App.eb.publish(["add:server", details])
    }
    
    static async onUpdateServer(targetId, newDetails) { 
        const currentServerDetails = 
            App.state.servers.find((item) => item.server.id == targetId)

        const serverIndex = App.state.servers.indexOf(currentServerDetails) 

        App.state.servers[serverIndex] = {
            ...currentServerDetails, 
            ...newDetails
        }

        await App.saveData()

        App.eb && App.eb.publish(["update:server", targetId, newDetails])
    }

    static async onDisableServer(targetId) {
        const item  = 
            App.state.servers.find((item) => item.server.id == targetId)
        
        item.disabled = true; 
        item.status = "DISABLED"

        await App.saveData() 

        App.eb && App.eb.publish(["disable:server", targetId])
    } 

    static async onEnableServer(targetId) {
        const item  = 
            App.state.servers.find((item) => item.server.id == targetId)
        
        item.disabled = false; 
        item.status = "ENABLED"

        await App.saveData() 

        App.eb && App.eb.publish(["enable:server", targetId])
    } 

    static async onRemoveServer(targetId) {
        const item = App.state.servers.find(item => item.id == targetId)
        const index = App.state.servers.indexOf(item)
        
        App.state.servers.splice(index, 1)  

        await App.saveData() 
        
        App.eb && App.eb.publish(["remove:server", targetId])
    }

    static async onChangeName(name)  {
        App.state.client.name = name;
        const toChange = {}
        
        for(let server of App.state.servers) {
            console.log("@ Updating name for [" + server.server.hostname + "]")
            try {
                const client = 
                    await ConnectionManager.useHttpClient({
                        ip: server.server.ip, 
                        port: server.server.port,
                        clientId: App.state.client.id,
                        clientSecret: App.state.client.secret
                    })

                await client.put("/clients/name", {
                    name: name
                }) 

                server.mustChangeName = false
            } catch(e) {
                console.log(
                    "@ Cannot change name of server " + 
                    "[" + server.server.hostname + "] : " +
                    "Postponed."
                )
                toChange[server.server.id] = true
            }
        }

        await App.saveData()

        App.eb && App.eb.publish(["change:name", App.state.client.name, toChange])
    }
}