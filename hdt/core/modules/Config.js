/**
 * Config Module 
 */

import { BASE_PATH } from "../../../index.js";
import fs from "fs/promises"

export default class Config 
{
    /** 
     * Configuration path.
     */
    static CONFIG_PATH = 
        BASE_PATH + "/common/config/notipp.config.json" 

    /**
     * Set/update configuration file.
     */
    static async setConfig(callback) {
        const config = await Config.getConfig()
        callback(config) 
        await fs.writeFile(
            Config.CONFIG_PATH, 
            JSON.stringify(config, null, 4)
        )
    }

    /**
     * Get configuration object 
     */
    static async getConfig() {
        const content =
            (await fs.readFile(Config.CONFIG_PATH)).toString() 

        const config = 
            JSON.parse(content)

        return config
    }
}