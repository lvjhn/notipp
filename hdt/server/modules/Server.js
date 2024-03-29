/** 
 * Server.js
 * 
 * Description: 
 *  The server class for cohesively structuring the server.
 */

import HttpController from "../controllers/HttpController.js";
import WsController from "../controllers/WsController.js";
import express from "express"
import { WebSocketServer } from "ws"
import https from "https"
import http from "http"
import fs from "fs/promises"
import { BASE_PATH } from "../../../index.js";
import Core from "../../core/Core.js";
import colors from  "@colors/colors"
import cors from "cors"
import bodyParser from "body-parser";
import GeneralInfo from "../../core/modules/GeneralInfo.js";
import Config from "../../core/modules/Config.js";
import Database from "../../data/Database.js";
import { execSync } from "child_process";
import Clients from "../../core/modules/Clients.js";

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
        // set up body parser 
        Server.app.use(bodyParser.json())
        Server.app.use(bodyParser.urlencoded({ extended: false }))

        // setup cors 
        Server.app.use(cors())

        // setup view engine 
        Server.app.set('view engine', 'hbs')
        Server.app.set('views', BASE_PATH + "/hdt/server/views")

        Server.httpApp.set('view engine', 'hbs')
        Server.httpApp.set('views', BASE_PATH + "/hdt/server/views")

        // create ping page   
        Server.app.get("/ping", (req, res) => {
            res.send("PONG")
        }) 

        // output ca-qr image 
        const ip = await GeneralInfo.getServerIp() 
        const httpPortNo = (await Config.getConfig()).server.httpPortNo
        const address = `http://${ip}:${httpPortNo}/download-ca`
        execSync(
            `qrcode '${address}' -o ` + 
            `${BASE_PATH}/outputs/ca-qr.png -d 100 -w 300`
        )
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

        // ----- qr code regeneratiion
        execSync(
            `qrcode '${JSON.stringify(qrData)}' -o ` + 
            `${BASE_PATH}/outputs/pair-qr.png -d 100 -w 300`
        )

        // ----- create express app
        console.log("\t> Creating express app...")
        Server.app = express() 
        Server.httpApp = express()

        await Server.setupPlugins()
        await Server.setupRoutes()
        
        // ----- create https server
        console.log("\t> Creating https server...")
        Server.httpsServer = 
            https.createServer(await Server.loadCertificates(), Server.app)
        
        // ----- create http server
        console.log("\t> Creating https server...")
        Server.httpServer = 
            http.createServer(Server.httpApp)
        
        Server.httpApp.get("/", HttpController.get) 
        Server.httpApp.get("/ca", HttpController.getCA)
        Server.httpApp.get("/download-ca", (req, res) => {
            res.render("download-ca", {})
        })

        // ----- create websocket server`
        console.log("\t> Creating websocket server...")

        Server.wsServer = new WebSocketServer({ 
            server: Server.httpsServer   
        })

        Server.wsServer.on("connection", async (socket, request) => {
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

        const httpPortNo = (await Config.getConfig()).server.httpPortNo
        Server.httpServer.listen(
            httpPortNo, address, async () => {
                const addressPort = address + ":" + httpPortNo
                console.log(
                    ("\t>> Notipp-Http-Server is listening on " + 
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

        // stop server
        if(Server.wsServer) {
            console.log("\t> Stopping websockets server...")
            await Server.wsServer.close()
        } 
        if(Server.httpsServer) { 
            console.log("\t> Stopping htts server...")
            await Server.httpsServer.close()
        }
        if(Server.httpServer) { 
            console.log("\t> Stopping htts server...")
            await Server.httpServer.close()
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