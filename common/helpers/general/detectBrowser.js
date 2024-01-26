/** 
 * detectBrowser.js 
 */

export const BROWSER_CHAIN = [
    "brave",
    "duckduckgo", 
    "vivaldi",
    "edge",
    "opera",
    "firefox",
    "chrome",
    "safari", 
    "notipp-client.pc-cli"
]

/* 
 * Description: 
 *  Detect browser from a supplied user agent string. 
 */
export default function detectBrowser(userAgent = "") {
   
    const userAgentLower = userAgent.toLowerCase()

    for(let browserNeedle of BROWSER_CHAIN) {
        if(userAgentLower.indexOf(browserNeedle) != -1) { 
            return browserNeedle 
        }
    }

    return "others"
}
