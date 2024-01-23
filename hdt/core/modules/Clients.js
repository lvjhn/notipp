/**
 * Clients Module 
 */

import Database from "../../data/Database.js";

export default class Clients 
{
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

    }

    /**
     * Get connected clients. 
     */
    static async getConnected() {

    }

    /**
     * Check if client is connected. 
     */
    static async isConnected(clientId) {

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
        
        qb.update() 
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
}   