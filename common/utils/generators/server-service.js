/**
 * service-ssl-certificate.js 
 * 
 * Generate the systemd service file for the client.
 */

import { execSync } from "child_process";
import fs from "fs" 
import Core from "../../../hdt/core/Core.js";
import { BASE_PATH } from "../../../index.js";

const TEMPLATE_FILE = "./common/utils/templates/node-server.service"
const TEMPLATE_CONTENT = fs.readFileSync(TEMPLATE_FILE)

fs.writeFileSync(
    "./utils/temp/notipp-server.service",
    String(TEMPLATE_CONTENT.toString())
        .replace(
            /<<DESCRIPTION>>/g, 
            "System service for server background process of notipp."
        ) 
        .replace(
            /<<NODE_EXEC>>/g, 
            execSync("which node").toString().trim()
        )
        .replace(
            /<<TARGET_MODULE>>/g, 
            BASE_PATH + "/hdt/server/index.js"
        )
        .replace(
            /<<WORKING_DIRECTORY>>/g, 
            process.cwd()
        )
        .replace(
            /<<USERNAME>>/g, 
            execSync("echo $USER").toString().trim()
        )
   
)

