/** 
 * create-database.js
 * 
 * Description: 
 *  Script to create database structure. 
 */

import Database, { DATABASE_PATH } from "../../hdt/data/Database.js";
import fs from "fs"


(async () => {
    // clear database
    await Database.clearDatabase() 

    // return (exit)
    process.exit()
})();
