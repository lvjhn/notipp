/** 
 * Server.js
 * 
 * Description: 
 *  The server class for cohesively structuring the server.
 */

import HttpController from "../controllers/HttpController.js";
import WsController from "../controllers/WsController.js";
import express from "express"
import { WebSocketServer} from "ws"
import https from "https"
import fs from "fs/promises"
import { BASE_PATH } from "../../../index.js";
import Core from "../../core/Core.js";
import colors from  "@colors/colors"

export default class Server 
{
    /**
     * Controllers
     */
    static app = null 
    static httpsServer = null 
    static wsServer = null 
    

    static wsController = new WsController()
    static httpController = new HttpController() 

    /**
     * Load certificates.
     */
    static async loadCertificates() {
        const KEY_PATH  = BASE_PATH + "/hdt/data/certificate/server-ssl.key" 
        const CERT_PATH = BASE_PATH + "/hdt/data/certificate/server-ssl.pem"

        return {
            key  : await fs.readFile(KEY_PATH),
            cert : await fs.readFile(CERT_PATH)
        }
    }

    /** 
     * Set up plugins.
     */
    static async setupPlugins() {
    
    }

    /** 
     * Set up routes. 
     */
    static async setupRoutes() {

    }

    /** 
     * Start server. 
     */
    static async start() {
        console.log("@ Starting server...")

        // create express app
        Server.app = express()  
        Server.app.get("/~ping", (req, res) => {
            res.send("PONG")
        })
    
        // create websocket server
        Server.wsServer = new WebSocketServer({ noServer: true })
        Server.app.on("upgrade", (request, socket, head) => {
            Server.app.handleUpgrade(request, socket, head, (websocket) => {
                Server.wsServer.emit("connection", websocket, request)  
            })
        })
        
        // create https serevr
        Server.httpsServer = 
            https.createServer(await Server.loadCertificates(), Server.app)

        // start listening on port
        const portNo  = (await Core.Config.getConfig()).server.portNo; 
        const address = "0.0.0.0"
        Server.httpsServer.listen(
            portNo, address, () => {
                const addressPort = address + ":" + portNo
                console.log(
                    ("@ Notipp-Server is listening on " + addressPort).cyan.bold
                ) 
            }
        )
    }

    /** 
     * Stop server.
     */
    static async stop () {
        console.log("@ Stopping server...")
        Server.wsServer.close() 
        Server.httpsServer.close()
    } 

    /** 
     * Restart server.
     */
    static async restart() {
        console.log("@ Restarting server...")
        await Server.stop()
        await Server.start()
    }
}   