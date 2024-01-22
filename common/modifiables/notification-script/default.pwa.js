/** 
 * default.pc-cli.js 
 */
import { execSync } from "child_process"

/**
 * Default notification script for PWA version.
 */
export default function showNotification(context) {
    context.registration.showNotification(context.title, context.options) 
}
