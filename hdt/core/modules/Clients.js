/**
 * Clients Module 
 */

import axios from "axios";
import generateSecret from "../../../common/helpers/general/generateSecret.js";
import DataItems from "../../data/DataItems.js";
import Database from "../../data/Database.js";
import Config from "./Config.js";
import GeneralInfo from "./GeneralInfo.js";
import Queries from "./Queries.js";
import makeClientOptions from "../../../common/utils/makeClientOptions.js";

export default class Clients 
{
    /** 
     * Add a client.
     */
    static async add(details, extras) {
        // handle auto-pairing 
        const autoPair = (await Config.getConfig()).server.autoPair
       
        if(autoPair) {
            details.isPaired = 1; 
        } else {
            details.isPaired = 0
        }

        details.lastRead = 0

        // check if pairing secret is valid 
        if(!autoPair && extras.pairSecret) {
            if(extras.pairSecret == await Clients.getPairingSecret()) {
                details.isPaired = 1
            }
        }

        // check if already added 
        const alreadyExists = await Clients.has(details.id)
        if(alreadyExists) {
            throw Error("CLIENT_ALREADY_EXISTS") 
        }
  
        // insert client details to database
        const insertQb = Database.connection("Clients") 
        const insertQuery = insertQb.insert(details)
        await insertQuery; 
    } 

    /** 
     * Remove a client.
     */
    static async remove(clientId) {
        const deleteQb = Database.connection("Clients") 
        deleteQb.where("clientId", clientId) 
        await deleteQb
    }

    /** 
     * Check for existence. 
     */
    static async has(clientId) {
        return await Queries.exists("Clients", (qb) => {
            qb.where("id", clientId)
        })
    }

    /** 
     * Update a client 
     */
    static async update(clientId, details) {
        let updateQb = Database.connection("Clients") 
        updateQb = updateQb.update(details) 
        updateQb = updateQb.where("id", clientId) 
        await updateQb
    } 

    /** 
     * Get a specific client. 
     */
    static async get(clientId) {
        let query = Database.connection("Clients")
        query = query.where("id", clientId) 
        query = query.limit(1)

        const results = await query 

        if(results.length == 0) {
            return null 
        } else {
            return results[0]
        }
    }

    /** 
     * Get all clients.
     */
    static async getAll() {
        return await Database.connection("Clients")
    }

    /** 
     * Get unpaired clients.
     */
    static async getUnpaired() {
        return (
            await Database.connection("Clients").where("isPaired", 0)
        )
    }

    /** 
     * Get unpaired clients.
     */
    static async getPaired() {
        return (
            await Database.connection("Clients").where("isPaired", 1)
        )
    } 

    /**
     * Get disconnected clients.
     */
    static async getDisconnected() {
        const portNo = 
            (await Config.getConfig()).server.portNo
        const clientIds =    
            (await axios.get(
                "https://localhost:" + portNo + "/connected-clients",
                await makeClientOptions()            
            )).data
        const clients = 
            await (Database.connection("Clients")
                .whereNotIn("id", clientIds)
            )
        return clients
    }

    /**
     * Get connected clients. 
     */
    static async getConnected() {
        const portNo = 
            (await Config.getConfig()).server.portNo
        const clientIds =    
            (await axios.get(
                "https://localhost:" + portNo + "/connected-clients",
                await makeClientOptions()            
            )).data
        const clients = 
            await (Database.connection("Clients")
                .whereIn("id", clientIds)
            )
        return clients
    }

    /**
     * Check if client is connected. 
     */
    static async isConnected(clientId) {
        const clientIds =    
            (await axios.get(
                "https://localhost:" + portNo + "/connected-clients",
                await makeClientOptions()            
            )).data
        return clientId in clientIds 
    }

    /** 
     * Check if client is paired.
     */
    static async isPaired(clientId) {
        let qb = Database.connection("Clients") 
        qb = qb.where("id", clientId)

        const results = await qb;
        
        if(results.length == 0) {
            return false 
        } 

        const isPaired = 
            results[0].isPaired == 1
        
        return isPaired;
    }

    /**
     * Pair a client 
     */
    static async pair(clientId) {
        let qb = Database.connection("clients")
        
        qb.update({ isPaired: 1 }) 
          .where({ id: clientId })

        await qb
    }

    /**
     * Unpair a client.
     */
    static async unpair(clientId) {
        let qb = Database.connection("Clients")
        
        qb.update({ isPaired: 0 }) 
          .where("id", clientId)

        await qb
    }

    /**
     * Pair all clients.
     */
    static async pairAll() {    
        let qb = Database.connection("Clients")

        qb.update({ isPaired: 1 }) 
          .where("isPaired", 0) 

        await qb
    }   

    /** 
     * Unpair all clients.
     */
    static async unpairAll() {
        let qb = Database.connection("Clients")

        qb.update({ isPaired: 0 }) 
          .where("isPaired", 1) 

        await qb
    }

    /**
     * Count unpaired.
     */
    static async countUnpaired() {
        let qb = Database.connection("Clients")

        qb = qb.count("id as count") 
        qb = qb.where("isPaired", 0)

        const results = await qb; 
        const count = results[0].count 
    
        return count
    }

    /** 
     * Count paired.
     */
    static async countPaired() {
        let qb = Database.connection("Clients")

        qb = qb.count("id as count") 
        qb = qb.where("isPaired", 1)

        const results = await qb; 
        const count = results[0].count 
    
        return count
    }

    /**
     * Count disconnected.
     */
    static async countDisconnected() {

    }

    /**
     * Count connected.
     */
    static async countConnected() {

    }

    /** 
     * Count all. 
     */
    static async countAll() {
        let qb = Database.connection("Clients")

        qb = qb.count("id as count") 

        const results = await qb; 
        const count = results[0].count 
    
        return count
    }

    /**
     * Check if client exists.
     */
    static async exists(clientId) {
        let qb = Database.connection("Clients")

        qb = qb.where("id", clientId) 
        qb = qb.limit(1) 

        const results = await qb; 
        const doesExist = results.length > 0

        return doesExist
    }

    /** 
     * Remove a client. 
     */
    static async remove(clientId) {
        let qb = Database.connection("Clients")

        qb = qb.where("id", clientId) 

        await qb.del() 
    }

    /** 
     * Remove all clients.
     */
    static async removeAll() {
        let qb = Database.connection("Clients")
        await qb.del() 
    }

    /** 
     * Generate pairing secret. 
     */
    static async generatePairingSecret() {
        await DataItems.setItem("PAIRING-SECRET", generateSecret())
    }

    /** 
     * Get pairing secret/ 
     */
    static async getPairingSecret() {
        return await DataItems.getItem("PAIRING-SECRET")
    }

    /** 
     * Generate QR data.
     */
    static async generateQRData() {
        const ip = await GeneralInfo.getServerIp() 
        const port = await GeneralInfo.getServerPort() 
        const pairSecret = await Clients.getPairingSecret() 
        return {
            ip, port, pairSecret
        }
    }

    /** 
     * Authorize a client 
     */
    static async authorize(id, secret) {
        if(!await Clients.has(id)) {
            throw Error("CLIENT_NOT_FOUND")
        }
        
        const client = await Clients.get(id) 

        if(client.secret != secret) {
            throw Error("INVALID_CREDENTIALS")
        } 

        return true; 
    }
}   
