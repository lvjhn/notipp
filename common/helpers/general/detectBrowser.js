/** 
 * detectBrowser.js 
 */

export const BROWSER_CHAIN = [
    "brave",
    "duckduckgo", 
    "vivaldi",
    "edge",
    "opera",
    "safari", 
    "firefox",
    "chrome"
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
