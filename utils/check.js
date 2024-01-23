import Core from "../hdt/core/Core.js"

async function checkGeneralInfo() {
    console.log("Server-ID: " + await Core.GeneralInfo.getServerId())
    console.log("Username: " + await Core.GeneralInfo.getUsername())
    console.log("Notipp-Version: " + await Core.GeneralInfo.getNotippVersion())
    console.log("Host-Name: " + await Core.GeneralInfo.getHostName())
    console.log("Operating-System: " + await Core.GeneralInfo.getOperatingSystem()) 
    console.log("Server-Secret: " + await Core.GeneralInfo.getServerSecret())

    console.log(await Core.GeneralInfo.getPublicInfo())
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
    await Core.Server.generateServerId()
    await Core.Server.generateServerSecret()
}

async function checkConfig() {
    // await Core.Config.setConfig((config) => {
    //     config.server.portNo = 10443
    // })
    console.log(await Core.Config.getConfig())
}

(async () => {  
    // checkConfig();
})()