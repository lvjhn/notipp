/** 
 * ConnectionManager.js 
 * 
 * Description: 
 *  Manages connection for different servers. 
 */

import { Agent } from "https";
import { BASE_PATH } from "../../index.js";
import fs from "fs/promises"
import { X509Certificate } from "crypto";

export default class AgentManager 
{
    /** 
     * Group Map
     */
    static groupMap = {}
    static CERTIFICATES_PATH = "./common/certificates/remote"

    /** 
     * Get the https agent for a specific server.
     */
    static async loadGroupMap() {
        const files = 
            await fs.readdir(ConnectionManager.CERTIFICATES_PATH) 

        let groupMap = {}
        
        for(let filename of files) {
            if(filename == ".gitignore") {
                continue;
            }

            await ConnectionManager.registerCertificate(
                ConnectionManager.CERTIFICATES_PATH + "/" + 
                filename
            )
        }
    }   

    /**
     * Get HTTPS Agent. 
     */
    static async useHttpsAgent(caFingerPrint) {
        return new Agent({
            rejectUnauthorized: false, 
            ca: await fs.readFile(
                ConnectionManager.CERTIFICATES_PATH + "/" +
                ConnectionManager.groupMap[caFingerPrint]
            )
        })
    }

    /** 
     * Register certificate.
     */
    static async registerCertificate(filepath) {
        const content = await fs.readFile(filepath)
        const certificate = new X509Certificate(content) 
        const filename = filepath.split("/").at(-1)
        ConnectionManager.groupMap[certificate.fingerprint] = filename 
    } 
}