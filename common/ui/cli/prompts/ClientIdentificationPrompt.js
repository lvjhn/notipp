/** 
 * ClientIdentificationPrompt.js 
 * 
 * Description: 
 *  Identifies which client to use. 
 */

import prompts from "prompts";
import Clients from "../../../../hdt/core/modules/Clients.js";
import Database from "../../../../hdt/data/Database.js";

export default class ClientIdentificationPrompt {
    static async run(message, choices) {
        const targetId = await prompts({
            type: "select", 
            name: "value", 
            message: message, 
            choices: choices.map(item => ({
                title: (`${item.name.bold.green} [${item.id}]`),
                value: item.id
            }))
        })
        return targetId.value
    }
}