import axios from "axios"

export default function createClient(server, store) {
    const ip = server.server.ip 
    const port = server.server.port
    const address = ip + ":" + port 
    const url = "https://" + address 
    const client = 
        axios.create({
            baseURL: url, 
            headers: {
                "client-id" : store.client.id, 
                "client-secret" : store.client.secret 
            }
        })
    return client
}