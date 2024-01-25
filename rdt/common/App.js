/**
 * App.js 
 * 
 * Description: 
 *  Centralized file for app. 
 */

import FileStorage from "../../common/helpers/file-storage/FileStorage.js"
import generateDeviceName from "../../common/helpers/general/generateDeviceName.js";
import generateSecret from "../../common/helpers/general/generateSecret.js";
import SimpleEventBus from "../../common/helpers/simple-event-bus/SimpleEventBus.js";
import ConnectionManager from "../../common/utils/ConnectionManager.js";
import Config from "../../hdt/core/modules/Config.js";
import { BASE_PATH } from "../../index.js";
import fs from "fs/promises"



export default class App 
{
    static SWITCH_PATH = BASE_PATH + "/rdt/receiver/switch" 
    static eb = false; 
    static manualSave = true;

    static state = {
        client: {
            id: crypto.randomUUID(), 
            name: generateDeviceName(), 
            secret: generateSecret(), 
            userAgent: "notipp-cli"
        }, 
        servers : [] 
    }

    static storage;

    static async init() {
        const portNo = (await Config.getConfig()).client.eventBusPort

        App.eb = new SimpleEventBus("127.0.0.1", portNo)

        try {
            App.eb.connect(true)
        } catch(e) {
            console.log("@ Warning: Cannot connect to event bus.")
        }

        // load data
        await App.loadData()
    }

    static async saveData() {
        if(App.manualSave) {
            await App.storage.setItem(
                "state", JSON.stringify(App.state, null, 4)
            )
        }
    }

    static async loadData() {
        if(!App.storage) {
            App.storage = await FileStorage.from("main")
        }

        if(!await App.storage.hasItem("state")) {
            await App.saveData()
        }

        App.state = JSON.parse(await App.storage.getItem("state"))
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

    static async onRemoveServer(targetId) {
        const item = App.state.servers.find(item => item.id == targetId)
        const index = App.state.servers.indexOf(item)
        
        App.state.servers.splice(index, 1)  

        await App.saveData() 
        
        App.eb && App.eb.publish(["remove:server", targetId])
    }

    static async onChangeName(name)  {
        App.state.client.name = name;
        
        for(let server of App.state.servers) {
            console.log("@ Updating name for [" + server.server.hostname + "]")
            server.mustChangeName = true;  

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
            }
        }

        await App.saveData()

        App.eb && App.eb.publish("change:name", name)
    }
}