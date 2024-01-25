/** 
 * ClientIdentificationPrompt.js 
 * 
 * Description: 
 *  Identifies which client to use. 
 */

import prompts from "prompts";
import Database from "../../../../hdt/data/Database.js";

export default class ServerIdentificationPrompt {
    static async run(message, choices) {
        const targetId = await prompts({
            type: "select", 
            name: "value", 
            message: message, 
            choices: choices.map(item => ({
                title: (item.server.hostname.white.bold + " :: ").bold.white + 
                        item.server.ip + ":" + item.server.port,
                value: item.server.id
            }))
        })
        return targetId.value
    }
}