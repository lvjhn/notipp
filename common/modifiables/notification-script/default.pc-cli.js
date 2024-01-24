/** 
 * default.pc-cli.js 
 */
import { execSync } from "child_process"

/**
 * Default notification script for PC-CLI version.
 */
export default function showNotification(details) {
    execSync(`notify-send ${details.title} ${details.options.body}`)
}