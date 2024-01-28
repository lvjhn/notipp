#!/usr/bin/env node
/** 
 * hdt/server/index.js 
 * 
 * Description: 
 *  Used for structuring the server cohesively.
 */

import { start } from "repl";
import { BASE_PATH } from "../../index.js";
import Core from "../core/Core.js";
import Server from "./modules/Server.js";
import fs from "fs"
import fsp from "fs/promises"
import GeneralInfo from "../core/modules/GeneralInfo.js";

async function printHeader() {
    console.log(
        ("NOTIPP-SERVER " + await GeneralInfo.getNotippVersion()).bold.green
    ) 
}

(async () => {
    await printHeader()
    await Core.Server.autoSwitch(Server)
})();