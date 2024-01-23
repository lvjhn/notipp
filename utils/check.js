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


(async () => {  
    await checkGeneralInfo()
    
    process.exit()
})()