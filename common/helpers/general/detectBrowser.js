/** 
 * detectBrowser.js 
 */

export const BROWSER_CHAIN = [
    "brave",
    "duckduckgo", 
    "vivaldi",
    "edge",
    "opera",
    "chrome",
    "firefox",
    "safari", 
    "notipp-client.pc-cli"
]

/* 
 * Description: 
 *  Detect browser from a supplied user agent string. 
 */
export default function detectBrowser(userAgent = "") {
   
    const userAgentLower = userAgent.toLowerCase()

    for(let i = 0; i < BROWSER_CHAIN.length; i++) {
        const browserNeedle = BROWSER_CHAIN[i]
        if(userAgentLower.indexOf(browserNeedle) != -1) { 
            console.log("Checking", browserNeedle, userAgentLower)
            return browserNeedle 
        }
    }

    return "others"
}
