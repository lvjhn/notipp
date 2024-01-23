/** 
 * hdt/server/index.js 
 * 
 * Description: 
 *  Used for structuring the server cohesively.
 */

import Server from "./modules/Server.js";

(async () => {
    try {
        await Server.start()
    } catch(error) {
        throw error
    }
})();