/** 
 * Server Module
 */
import fs from "fs/promises"
import { BASE_PATH } from "../../../index.js"
import generateSecret from "../../../common/helpers/general/generateSecret.js"

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

    }

    /** 
     * Check if server is down. 
     */
    static async isDown() {

    }

    /** 
     * Turn off server. 
     */
    static async turnOff() {

    }

    /** 
     * Turn on server.
     */
    static async turnOn() {

    }

    /** 
     * Enable 
     */
    static async enable() {

    }

    /**
     * Disable
     */
    static async disable() {
        
    }
}