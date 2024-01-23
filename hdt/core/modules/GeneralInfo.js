/**
 * GeneralInfo Module
 */

import { BASE_PATH } from "../../../index.js";
import fs from "fs/promises"
import { exec } from "child_process"
import Config from "./Config.js";
import { Certificate } from "crypto";
import Certificates from "./Certificates.js";
import axios from "axios";

export default class GeneralInfo 
{
    /** 
     * Get information.
     */
    static async getFullInfo() {
        return {
            "notipp" : {
                "version" : await GeneralInfo.getNotippVersion(),
                "username" : await GeneralInfo.getUsername()
            },
            "server" : {
                "id" : await GeneralInfo.getServerId(), 
                "hostname" : await GeneralInfo.getHostName(), 
                "ip" : await GeneralInfo.getServerIp(), 
                "port" : await GeneralInfo.getServerPort(), 
                "os" : await GeneralInfo.getOperatingSystem(),
                "ssl-cert" : {
                    "expiration" : 
                        await Certificates.getExpirationDate("server-ssl-cert"), 
                    "fingerprint" : 
                        await Certificates.getFingerprint("server-ssl-cert")
                }
            }, 
            "ca-cert" : {
                "expiration" : 
                    await Certificates.getExpirationDate("ca-cert"), 
                "fingerprint" : 
                    await Certificates.getFingerprint("ca-cert")
            }
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

    /**
     * Get server ip.
     */
    static async getServerIp() {
        return new Promise((resolve, reject) => {
            exec(`hostname -I | awk '{print $1}'`, 
                (error, stdout, stderr) => {
                    if(error) {
                        reject(error) 
                    }
                    resolve(stdout.trim())
                }
            )
        })
    }

    /**
     * Get server port.
     */
    static async getServerPort() {
        return (await Config.getConfig()).server.portNo
    }

    /**
     * Get CA certificate.
     */
    static async getCACert() {
        const CERTIFICATE_PATH = 
            BASE_PATH + "/common/ca/hdt-ca.pem" 
            
        return (await fs.readFile(CERTIFICATE_PATH)).toString()
    }

}
