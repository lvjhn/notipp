/** 
 * Auth.js 
 * 
 * Description: 
 *  Defines authorization function (middlewares) for REST actions. 
 */

import Clients from "../../core/modules/Clients.js"

export default class Auth 
{   
    /** 
     * Authorize clients 
     */  
    static async authorizeClient(req, res, next) {
        const clientId = req.headers["client-id"] 
        const clientSecret = req.headers["client-secret"]

        if(!clientId || !clientSecret) {
            res.send("MISSING_CREDENTIALS")
            return
        }

        // check if client exists 
        if(!(await Clients.has(clientId))) {
            res.send("CLIENT_DOES_NOT_EXIST")
            return
        }

        // check if secret matches 
        const client = await Clients.get(clientId)
        
        if(client.secret == clientSecret) {
            next()
        } else {
            res.send("INVALID_CLIENT_SECRET")
            return
        }
    } 

    /** 
     * Authorize server
     */
    static async authorizeServer(req, res, next) {

    }
}