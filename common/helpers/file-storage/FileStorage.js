/** 
 * FileStorage.js 
 * 
 * Description: 
 *  Simulate/emulate localStorage API in desktop based components. 
 */
import { BASE_PATH } from "../../../index.js"
import fs from "fs/promises"
import fsb from "fs"

export default class FileStorage 
{
    constructor() {
        
    }

    static async from(context) {
        const storage = new FileStorage()
        storage.setContext(context)
        return storage
    }

    async setContext(context) {
        const path = 
            BASE_PATH + "/common/helpers/file-storage/data/" +
            context + ".data" 
        if(!await fsb.existsSync(path)) {
            await fs.writeFile(path, "{}")
        }
        this.storagePath = path
    }

    async setItem(key, value) {
        await fs.copyFile(this.storagePath, this.storagePath + ".backup")
        const data = JSON.parse(await fs.readFile(this.storagePath))
        data[key] = value 
        await fs.writeFile(this.storagePath, JSON.stringify(data, null, 4))
    }

    async getAllItems() {
        const data = JSON.parse(await fs.readFile(this.storagePath)) 
        return data;
    }

    async getItem(key) {
        return (await this.getAllItems())[key]
    }

    async hasItem(key) {
        return key in (await this.getAllItems())
    }

    async removeItem(key) {
        const data = await this.getAllItems()
        delete data[key]
        await fs.writeFile(this.storagePath, JSON.stringify(data, null, 4))
    }

    async clear() {
        await fs.writeFile(this.storagePath, "{}")
    }
}