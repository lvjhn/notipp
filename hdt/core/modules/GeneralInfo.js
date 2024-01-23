/**
 * GeneralInfo Module
 */

import { BASE_PATH } from "../../../index.js";
import fs from "fs/promises"
import { exec } from "child_process"

export default class GeneralInfo 
{
    /** 
     * Get public info as JSON object. 
     */
    static async getPublicInfo() {
        return {
            serverId: await GeneralInfo.getServerId(), 
            username: await GeneralInfo.getUsername(), 
            hostname: await GeneralInfo.getHostName(), 
            operatingSystem: await GeneralInfo.getOperatingSystem(), 
            serverSecret: await GeneralInfo.getServerSecret()
        }
    }

    /** 
     * Helper function to read info file.
     */
    static async readInfoFile(key) {
        const INFO_FILE = BASE_PATH + "/hdt/info/" + key 
        const INFO_VALUE = 
            (await fs.readFile(INFO_FILE)).toString().trim() 
        return INFO_VALUE
    }
    
    /** 
     * Get server id.
     */
    static async getServerId() {
        return await GeneralInfo.readInfoFile("server-id")
    }

    /** 
     * Get notipp version.
     */
    static async getNotippVersion() {
        const INFO_FILE = BASE_PATH + "/version"
        const INFO_VALUE = 
            (await fs.readFile(INFO_FILE)).toString().trim() 
        return INFO_VALUE
    }

    /**
     * Get host name.
     */
    static async getHostName() {
        return await GeneralInfo.readInfoFile("hostname")
    }   

    /** 
     * Get operating system.
     */
    static async getOperatingSystem() {
        return await GeneralInfo.readInfoFile("os")
    }

    /**
     * Get username. 
     */
    static async getUsername() {
        return await GeneralInfo.readInfoFile("username")
    }

    /**
     * Get server secret.
     */
    static async getServerSecret() {
        return await GeneralInfo.readInfoFile("server-secret")
    }
}
