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
import cors from "cors"
import bodyParser from "body-parser";

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
        // create ping page   
        Server.app.get("/~ping", (req, res) => {
            res.send("PONG")
        })

        // set up body parser 
        Server.app.use(bodyParser.json())
        Server.app.use(bodyParser.urlencoded({ extended: false }))

        // setup cors 
        Server.app.use(cors())

    }

    /** 
     * Set up routes. 
     */
    static async setupRoutes() {
        await HttpController.setupRoutes(Server.app)
    }

    /** 
     * Start server. 
     */
    static async start() {
        console.log("@ Starting server...".bgBlack.white.bold)

        // ----- create express app
        console.log("\t> Creating express app...")
        Server.app = express() 

        await Server.setupPlugins()
        await Server.setupRoutes()
    
        // ----- create websocket server
        console.log("\t> Creating websocket server...")
        Server.wsServer = new WebSocketServer({ noServer: true })
        Server.app.on("upgrade", (request, socket, head) => {
            Server.app.handleUpgrade(request, socket, head, (websocket) => {
                Server.wsServer.emit("connection", websocket, request)  
            })
        })
        
        // ----- create https server
        console.log("\t> Creating https server...")
        Server.httpsServer = 
            https.createServer(await Server.loadCertificates(), Server.app)

        
        // ----- start listening on port
        console.log("\t> Starting listener...")
        const portNo  = (await Core.Config.getConfig()).server.portNo; 
        const address = "0.0.0.0"
        
        Server.httpsServer.listen(
            portNo, address, () => {
                const addressPort = address + ":" + portNo
                console.log(
                    ("\t>> Notipp-Server is listening on " + 
                         addressPort + 
                     " <<").cyan.bold 
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