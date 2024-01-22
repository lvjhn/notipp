/** 
 * seed-database.js
 * 
 * Description: 
 *  Script to seed database data. 
 */

import DatabaseSeeder from "../../hdt/data/DatabaseSeeder.js";

(async () => {
    // setup database
    await DatabaseSeeder.seed()

    // return (exit)
    process.exit()
})();
