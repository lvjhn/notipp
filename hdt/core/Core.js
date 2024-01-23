import Certificates from "./modules/Certificates.js";
import Clients from "./modules/Clients.js";
import Config from "./modules/Config.js";
import Queries from "./modules/Queries.js";
import GeneralInfo from "./modules/GeneralInfo.js";
import Server from "./modules/Server.js";
import Notifications from "./modules/Notifications.js";

/** 
 * Core Module 
 */
export default class Core 
{
    static GeneralInfo = GeneralInfo;
    static Certificates = Certificates; 
    static Server = Server; 
    static Queries = Queries;
    static Clients = Clients; 
    static Notifications = Notifications; 
    static Config = Config;
}