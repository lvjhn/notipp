import ConnectionManager from "../common/utils/ConnectionManager.js"
import Core from "../hdt/core/Core.js"
import Clients from "../hdt/core/modules/Clients.js"
import DatabaseSeeder from "../hdt/data/DatabaseSeeder.js"

async function checkGeneralInfo() {
    console.log("Server-ID: " + await Core.GeneralInfo.getServerId())
    console.log("Username: " + await Core.GeneralInfo.getUsername())
    console.log("Notipp-Version: " + await Core.GeneralInfo.getNotippVersion())
    console.log("Host-Name: " + await Core.GeneralInfo.getHostName())
    console.log("Operating-System: " + await Core.GeneralInfo.getOperatingSystem()) 
    console.log("Server-Secret: " + await Core.GeneralInfo.getServerSecret())

    console.log(await Core.GeneralInfo.getFullInfo())
}

async function checkCertificates() {
    console.log(
        "CA-Certificate:\n" +
        await Core.Certificates.getCACertificate()
    )
    console.log(
        "Server-SSL-Certificate:\n" +
        await Core.Certificates.getServerSSLCertificate()
    )
    console.log(
        "CA-Certificate-Expiration: \n" + 
        await Core.Certificates.getExpirationDate("ca-cert")
    )
    console.log(
        "Server-SSL-Certificate-Expiration: \n" + 
        await Core.Certificates.getExpirationDate("server-ssl-cert")
    )

    await Core.Certificates.generateServerSSLCertificate()
}

async function checkServer() {
    // await Core.Server.generateServerId()
    // await Core.Server.generateServerSecret()

    console.log("Is up? : " + await Core.Server.isUp())
    console.log("Is down? : " + await Core.Server.isDown())

    await Core.Server.enable()

}

async function checkConfig() {
    // await Core.Config.setConfig((config) => {
    //     config.server.portNo = 10443
    // })
    console.log(await Core.Config.getConfig())
}

async function checkQueries() {
    // const results = await Core.Queries.search("Notifications", {
    //     query: "%a%",
    //     queryFields: ["data"],
    //     perPage: 10
    // })
    // console.log(results)

    await DatabaseSeeder.seed()
    await Core.Queries.prune("Notifications", new Date(2022, 0, 1))
    await Core.Queries.prune("Notifications", new Date(2023, 12, 31), {
        modifier: "after"
    })
}

async function checkClients() {
    // console.log("All             : " + (await Clients.getAll()).length)
    // console.log("Unpaired        : " + (await Clients.getUnpaired()).length)
    // console.log("Paired          : " + (await Clients.getPaired()).length)
    // // console.log("Disconnected   : " + (await Clients.getDisconnected()).length)
    // // console.log("Connected      : " + (await Clients.getConnected()).length)

    // console.log("Is Paired (T)   : " + (await Clients.isPaired("d2482477-78ec-5ed7-90c9-bfa325f67fb3")))
    // console.log("Is Paired (F)   : " + (await Clients.isPaired("1234")))
    // console.log("Is Paired (F)   : " + (await Clients.isPaired("9f5142d5-6003-5910-a8a3-52a910a41fff")))

    // // await Clients.pair("9f5142d5-6003-5910-a8a3-52a910a41fff")
    // // await Clients.unpair("9f5142d5-6003-5910-a8a3-52a910a41fff")
    // // await Clients.pairAll()
    // // await Clients.unpairAll()

    // console.log(".countUnpaired()   : " + (await Clients.countUnpaired()))
    // console.log(".countPaired()     : " + (await Clients.countPaired()))
    // // console.log(".countDisconnected() : " + (await Clients.countConnected()))
    // // console.log(".countConnected()   : " + (await Clients.countConnected()))
    // console.log(".countAll()        : " + (await Clients.countAll()))

    // console.log("Exists (T)         : " + (await Clients.exists("9f5142d5-6003-5910-a8a3-52a910a41fff")))
    // console.log("Exists (F)         : " + (await Clients.exists("1234")))

    // // await Clients.remove("9f5142d5-6003-5910-a8a3-52a910a41fff")
    // // await Clients.removeAll() 

    await Clients.setConnectedStatus("75c35894-e74a-48d3-af37-f41cea9df9b3")
}


(async () => {  
    await checkClients() 
    process.exit()
})()