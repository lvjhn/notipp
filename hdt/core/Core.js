import Certificates from "./modules/Certificates.js";
import Clients from "./modules/Clients.js";
import Config from "./modules/Config.js";
import ConnectionManager from "./modules/ConnectionManager.js";
import DatabaseTable from "./modules/DatabaseTable.js";
import GeneralInfo from "./modules/GeneralInfo.js";
import NotificationsModule from "./modules/Notifications.js";
import Server from "./modules/Server.js";

/** 
 * Core Module 
 */
export default class Core 
{
    static GeneralInfo = GeneralInfo;
    static Certificates = Certificates; 
    static Server = Server; 
    static DatabaseTable = DatabaseTable;
    static Clients = Clients; 
    static Notifications = NotificationsModule; 
    static ConnectionManager = ConnectionManager; 
    static Config = Config;
}