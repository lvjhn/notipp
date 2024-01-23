/** 
 * hdt/server/index.js 
 * 
 * Description: 
 *  Used for structuring the server cohesively.
 */

import Server from "./modules/Server.js";

Server.start()

setTimeout(() => {
    Server.restart()
}, 5000)