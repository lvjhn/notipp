/**
 * client-ssl-certificate.js 
 * 
 * Generate the systemd service file for the client.
 */

import { execSync } from "child_process";
import fs from "fs" 
import { BASE_PATH } from "../../../index.js";

const TEMPLATE_FILE = "./common/utils/templates/node-client.service"
const TEMPLATE_CONTENT = fs.readFileSync(TEMPLATE_FILE)

fs.writeFileSync(
    "./utils/temp/notipp-client.service",
    String(TEMPLATE_CONTENT.toString())
        .replace(
            /<<DESCRIPTION>>/g, 
            "System service for notifications listener of notipp."
        ) 
        .replace(
            /<<NODE_EXEC>>/g, 
            execSync("which node").toString().trim()
        )
        .replace(
            /<<WORKING_DIRECTORY>>/g, 
            process.cwd()
        )
        .replace(
            /<<TARGET_MODULE>>/g, 
            BASE_PATH + "/rdt/receiver/index.js"
        )
        .replace(
            /<<USERNAME>>/g, 
            execSync("echo $USER").toString().trim()
        )
)

