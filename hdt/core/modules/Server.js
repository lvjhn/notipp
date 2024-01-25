/** 
 * Server Module
 */
import fs from "fs/promises"
import fsb  from "fs"
import { BASE_PATH } from "../../../index.js"
import generateSecret from "../../../common/helpers/general/generateSecret.js"
import axios from "axios"
import ConnectionManager from "../../../common/utils/ConnectionManager.js"
import Config from "./Config.js"
import { exec, execSync } from "child_process"
import inputPassword from "password-prompt"
import { Agent } from "https"



export default class Server
{
    /** 
     * Constants
     */
    static SWITCH_PATH = BASE_PATH + "/hdt/server/switch";

    /** 
     * Generate random server id. 
     */
    static async generateServerId() {
        const uuid = crypto.randomUUID() 
        await fs.writeFile(BASE_PATH + "/hdt/info/server-id", uuid)
    }

    /**
     * Generate random server secret. 
     */
    static async generateServerSecret() {
        const secret = generateSecret()
        await fs.writeFile(BASE_PATH + "/hdt/info/server-secret", secret)
    }

    /**
     * Check if server is up. 
     */
    static async isUp() {
        const portNo = (await Config.getConfig()).server.portNo 
        try {
            const client = axios.create({
                baseURL: `https://127.0.0.1:${portNo}`,
                httpsAgent: Agent({
                    rejectUnauthorized: false
                })
            })
            const ping = await client.get("/~ping") 
            return ping.data == "PONG" 
        } catch(e) {
            return false
        }
    }

    /** 
     * Check if server is down. 
     */
    static async isDown() {
        return !(await Server.isUp())
    }

    /** 
     * Turn off server. 
     */
    static async turnOff() {
        return await fs.writeFile(
            BASE_PATH + "/hdt/server/switch", 
            "OFF:" + (new Date()).getTime()
        )
    }

    /** 
     * Turn on server.
     */
    static async turnOn() {
        return await fs.writeFile(
            BASE_PATH + "/hdt/server/switch", 
            "ON:" + (new Date()).getTime()
        )
    }

    /** 
     * Enable 
     */
    static async enable() {
        return new Promise((resolve, reject) => {
            exec(
                "sudo systemctl enable notipp-server", 
                (error, stdout, stderr) => {
                    if(error) {
                        reject(error)
                    }
                    resolve(stdout)
                }  
            )
        })
    }

    /**
     * Disable
     */
    static async disable() {
        return new Promise((resolve, reject) => {
            exec(
                "sudo systemctl disable notipp-server",
                (error, stdout, stderr) => {
                    if(error) {
                        reject(error) 
                    }
                    resolve(stdout)
                }
            )
        })
    }

    /**
     * Check if enabled 
     */
    static async isEnabled() {
        return new Promise((resolve, reject) => {
            exec(
                "sudo systemctl is-enabled notipp-server", 
                (error, stdout, stderr) => {
                    if(error) {
                        reject(stderr)
                    }
                    resolve(stdout)
                }
            )
        })
    }

    /** 
     * Reload 
     */
    static async reload() {
        await Server.turnOff() 
        await Server.turnOn()
    }

    /** 
     * Read state. 
     */
    static async readState() {
        const content = await fs.readFile(Server.SWITCH_PATH); 
        const contentStr = content.toString() 
        const tokens = contentStr.split(":")
        return tokens[0]
    }
    
    /** 
     * Should on
     */
    static async shouldOn() {
        return (await Server.readState()) == "ON"
    }

    /** 
     * Auto-switch
     */
    static async autoSwitch(ServerClass) {
        // first time startup 
        await ServerClass.start();

        let prevMessage = ""

        // check if listening 
        fsb.watch(Server.SWITCH_PATH, async (event, filename) => {
            const currMessage = await Server.readState()
            if(event == "change" &&  prevMessage != currMessage) {
                console.log("@ <-- Received " + currMessage + " message...")
                prevMessage = currMessage
                
                if(await Server.shouldOn()) {
                    await ServerClass.start() 
                }
                else if(!(await Server.shouldOn())) {
                    await ServerClass.stop()
                }
            }
        })
    }
}