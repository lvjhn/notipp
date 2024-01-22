/** 
 * DataItems.js 
 * 
 * Description: 
 *  Class for manipulating the DataItems table of the database. 
 *  Simulates browser's LocalStorage.
 */

import Database from "./Database.js";

export default class DataItems 
{
    /**
     * Set an item. 
     */
    static async setItem(key, value) {
        const Table = Database.connection("DataItems")
        
        if(!(await DataItems.hasItem(key))) {
            await Table.insert({ key, value })
        }     
        else {
            await Table.update({ value }).where("key", "=", key)
        }
    }

    /**
     * Get an item.
     */
    static async getItem(key) {
        const Table = Database.connection("DataItems") 
        const result = await Table.where("key", "=", key).limit(1)
        return result[0].value
    }

    /**
     * Get all items. 
     */
    static async getAllItems() {
        const results = await Database.connection("DataItems") 
        return results;
    }

    /** 
     * Remove item. 
     */
    static async removeItem(key) {
        const Table = Database.connection("DataItems")
        await Table.where("key", "=", key).delete() 
    } 

    /**
     * Has items.
     */
    static async hasItem(key) {
        const Table = Database.connection("DataItems")
        const results = await Table.where("key", "=", key)
        return results.length > 0
    }

    /**
     * Clear items. 
     */
    static async clear() {
        const Table = Database.connection("DataItems")
        await Table.del()
    }   
}