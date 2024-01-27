import { Agent } from "https"
import GeneralInfo from "../../hdt/core/modules/GeneralInfo.js"

export default async function makeClientOptions() {
    return {
        httpsAgent: new Agent({
            ca: await GeneralInfo.getCACert()
        }),
        headers: {
            "server-secret" : await GeneralInfo.getServerSecret()
        }
    }
}
