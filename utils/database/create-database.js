/** 
 * create-database.js
 * 
 * Description: 
 *  Script to create database structure. 
 */

import Database, { DATABASE_PATH } from "../../hdt/data/Database.js";
import fs from "fs"


(async () => {
    // create database file 
    if(!fs.existsSync(DATABASE_PATH)) {
        fs.writeFileSync(DATABASE_PATH, "")
    }
    
    // setup database
    await Database.setup() 

    // return (exit)
    process.exit()
})();
