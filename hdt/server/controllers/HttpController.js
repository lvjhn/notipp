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
import Clients from "../../core/modules/Clients.js"
import Auth from "../modules/Auth.js"
import Queries from "../../core/modules/Queries.js"

export default class HttpController 
{   
    /** 
     * Setup routes.
     */
    static async setupRoutes(app) {
        app.get("/info", 
            HttpController.getInfo
        )
        
        app.get("/fingerprint", 
            HttpController.getFingerprint
        )
        
        app.get("/ca-string", 
            HttpController.getCAString
        )
        
        app.get("/ca", 
            HttpController.getCA
        )
        
        app.post("/clients", 
            HttpController.postClients
        )
        
        app.post("/emit/notification", 
            HttpController.postEmitNotification
        )
        
        app.get("/notifications", 
            Auth.authorizeClient, 
            HttpController.getNotifications    
        ) 
        
        app.put("/clients/name", 
            Auth.authorizeClient,
            HttpController.putClientsName
        )
    }

    static async getInfo(req, res) {
        res.send(await Core.GeneralInfo.getFullInfo())
    }

    static async getFingerprint(req, res) {
        res.send(await Core.Certificates.getFingerprint("ca-cert"))
    }

    static async getCAString(req, res) {
        res.send(await Core.GeneralInfo.getCACert())
    }

    static async getCA(req, res) {
        res.download(
            BASE_PATH + "/common/ca/hdt-ca.pem", 
            await Core.GeneralInfo.getUsername() + ".notipp.pem"
        )
    }

    static async postClients(req, res) {
        const data = req.body 
        try {
            await Clients.add(data.details, data.extras) 
            res.send("OK")
        } catch(e) {
            console.error(e)
            res.send(e.message)
        }
    } 

    static async postEmitNotification(req, res) {

    }

    static async getNotifications(req, res) {
        const options = req.query
        try { 
            const results =
                await Queries.search("Notifications", {
                    query: options.query,
                    queryFields: ["data"],
                    perPage: options.perPage
                })
            res.send(results)
        } catch(e) {
            console.error(e)
            res.send(e.message)
        }
    }

    static async putClientsName(req, res) {
        const clientId = req.headers["client-id"]
        const name = req.body.name
        try { 
            await Clients.update(clientId, {
                name: name
            })
            res.send("OK")
        } catch (e) {
            console.error(e)
            res.send(e.message)
        }
    }
}