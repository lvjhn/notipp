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
import GeneralInfo from "../../core/modules/GeneralInfo.js";
import Config from "../../core/modules/Config.js";

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
    
    static isListening = false
    static isStarting = false 
    static isStopping = false

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

        // setup view engine 
        Server.app.set('view engine', 'ejs')
        Server.app.set('views', BASE_PATH + "/hdt/server/views")

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
    static async start(onListen = () => {}) {
        console.log("@ Starting server...")
        
        if(!(await Core.Server.shouldOn())) {
            console.log("\t> Cannot start server. Server is turned off.".bold.red)
            return;
        }
        
        if(await Core.Server.isUp()) {
            console.log("\t> Cannot start server. Server is already up.".bold.red)
            return;
        }

        // ----- create express app
        console.log("\t> Creating express app...")
        Server.app = express() 

        await Server.setupPlugins()
        await Server.setupRoutes()
        
        // ----- create https server
        console.log("\t> Creating https server...")
        Server.httpsServer = 
            https.createServer(await Server.loadCertificates(), Server.app)
    
        // ----- create websocket server
        console.log("\t> Creating websocket server...")
        
        Server.wsServer = new WebSocketServer({ 
            server: Server.httpsServer   
        })

        Server.wsServer.on('connection', async (socket, request) => {
            await WsController.handleConnection(socket, request)
        });
    
        // ----- start listening on port
        console.log("\t> Starting listener...")
        const portNo  = (await Core.Config.getConfig()).server.portNo; 
        const address = "0.0.0.0"
        
        Server.httpsServer.listen(
            portNo, address, async () => {
                const addressPort = address + ":" + portNo
                console.log(
                    ("\t>> Notipp-Server is listening on " + 
                         addressPort + 
                     " <<").cyan.bold 
                ) 
                Server.isStarting = false
                Server.isListening = true
            }
        )
    }

    /** 
     * Stop server.
     */
    static async stop () {
        console.log("\t> Stopping server.".bold.grey)

        // guard
        if(Server.isStopping) {
            return 
        }

        Server.isStopping = true

        // sotp server
        if(Server.wsServer) {
            console.log("\t> Stopping websockets server...")
            await Server.wsServer.close()
        } 
        if(Server.httpsServer) { 
            console.log("\t> Stopping htts server...")
            await Server.httpsServer.close()
        }

        console.log("\t> Stopped server.".bold.italic.grey)

        Server.isStopping = false
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