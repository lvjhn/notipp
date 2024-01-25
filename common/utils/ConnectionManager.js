/** 
 * ClientManager.js 
 * 
 * Description: 
 *  Manage clients for connecting to different servers.
 */

import axios from "axios";
import https, { Agent } from "https";
import { BASE_PATH } from "../../index.js";
import fs from "fs/promises"

export default class ConnectionManager 
{
    static certificates = {};
    
    static async useHttpClient({ ip, port, clientId, clientSecret }) {
        const address = `https://${ip}:${port}`
        
        const preClient = axios.create({
            baseURL: address, 
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })

        try {
            // access fingerprint again and again to handle changing servers
            const fingerprint = await preClient.get("/fingerprint")

            // use cached fingerprint
            if(fingerprint.data in ConnectionManager.certificates) {
                const client =
                    axios.create({
                        baseURL: address,
                        httpsAgent: new Agent({
                            ca: (await fs.readFile("./common/ca/hdt-ca.pem")).toString()
                        })
                    })
                
                client.interceptors.request.use(function (config) {
                    config.headers["Client-ID"] = clientId 
                    config.headers["Client-Secret"] = clientSecret
                    return config;
                });

                return client
            }

            // register ca through fingerprint
            const ca = await preClient.get("/ca-string")
            ConnectionManager.certificates[fingerprint.data] = ca.data 

            return ConnectionManager.useHttpClient({ 
                ip, port, clientId, clientSecret 
            })
        } catch(e) {
            throw e
        }
    }
}