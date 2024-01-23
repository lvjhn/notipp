/** 
 * HttpController.js 
 * 
 * Describes: 
 *  Actions for handling REST/HTTP routes. 
 */

import { BASE_PATH } from "../../../index.js"
import Core from "../../core/Core.js"
import Certificates from "../../core/modules/Certificates.js"
import fs from "fs/promises"

export default class HttpController 
{   
    /** 
     * Setup routes.
     */
    static async setupRoutes(app) {
        app.get("/info", HttpController.info)
        app.get("/fingerprint", HttpController.fingerprint)
        app.get("/ca", HttpController.ca)
    }

    static async info(req, res) {
        res.send(await Core.GeneralInfo.getFullInfo())
    }

    static async fingerprint(req, res) {
        res.send(await Core.Certificates.getFingerprint("ca-cert"))
    }

    static async ca(req, res) {
        res.send(await Core.GeneralInfo.getCACert())
    }
}