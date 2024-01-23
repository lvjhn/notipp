/** 
 * Server Module
 */
import fs from "fs/promises"
import { BASE_PATH } from "../../../index.js"
import generateSecret from "../../../common/helpers/general/generateSecret.js"
import Core from "../Core.js"
import axios from "axios"
import ConnectionManager from "../../../common/utils/ConnectionManager.js"
import Config from "./Config.js"
import { execSync } from "child_process"
import inputPassword from "password-prompt"

export default class Server
{
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
        const client = await ConnectionManager.useHttpClient({
            ip: "127.0.0.1", 
            port: 10443
        })
        const ping = await client.get("/~ping") 
        return ping.data == "PONG" 
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
        execSync(`sudo systemctl enable notipp-server`)
    }

    /**
     * Disable
     */
    static async disable() {
        execSync(`sudo systemctl disable notipp-server`)
    }
}