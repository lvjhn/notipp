/** 
 * Connect to server.
 */
import axios from "axios"
import { setModal } from "../composables/useModal"
import ServerAddedModal from "@/modals/ServerAddedModal.vue"
import ServerUpdatedModal from "@/modals/ServerUpdatedModal.vue"

export default async function addServer({
    ip, port, store, submissionState, mustMatchId, pairSecret
}) {
    
    const baseURL = `https://${ip}:${port}/`

        console.log("@ Connecting to: " + baseURL) 

        const client = axios.create({
            baseURL: baseURL,
            timeout: 3000,
            headers: {
                "client-id" : store.client.id,
                "client-secret" : store.client.secret
            }
        })

        /**
         * Ping server
         */
        console.log("@ Pinging server...")
        submissionState.value = "Pinging"
        const pingRes = await client.get("/ping")

        /**
         * Identify server. 
         */
        console.log("@ Identifying server...")
        submissionState.value = "Identifying"
        const infoRes = await client.get("/info")
        const info = infoRes.data 

        // get key info 
        const serverId = info.server.id 

        if(mustMatchId) {
            if(serverId != mustMatchId) {
                throw new Error("IDs do not match.")
            }
        }
        
        // patch info with additional details 
        info["client-state"] = {
            "status" : "IDENTIFIED", 
            "lastRead" : 0, 
            "isEnabled" : true
        }

        /**
         * Adding
         */
        submissionState.value = "Adding"

        const server =
            await store.servers.find((item) => item.server.id == serverId)

        if(server) {
            console.log("@ Server already exists, updating...")
            await store.updateServer(serverId, info)

            setModal(ServerUpdatedModal, {
                server: info
            })

        } else {
            console.log(
                "@ Server does not exist...")
            
            await store.addServer(info)

            setModal(ServerAddedModal, {
                server: info
            })
        }

        /**
         * Registering 
         */
        const isRegRes = await client.get("/is-registered") 
        submissionState.value = "Registering"

        if(isRegRes.data == "OK") {
            console.log("@ Client is already registered...")

            if(pairSecret) {
                await client.post("/client/pair", {
                    pairSecret
                })
                console.log("@ Attempted to pair client...")
            }

        } else {
            console.log(
                "@ Client is not yet registered, " + 
                "registering first..."
            )

            const inputs = {
                details : store.client,  
                extras: {}
            }

            if(pairSecret) {
                inputs.extras = {
                    pairSecret
                }
            }

            const regRes =
                await client.post("/clients", inputs)

            if(regRes.data != "OK") {
                throw Error("Cannot register client.")
            }
        }

        // patch info with additional details 
        info["client-state"]["status"] = "REGISTERED"

       
}