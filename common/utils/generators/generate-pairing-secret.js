import Clients from "../../../hdt/core/modules/Clients.js"
import DataItems from "../../../hdt/data/DataItems.js"
import { BASE_PATH } from "../../../index.js"
import generateSecret from "../../helpers/general/generateSecret.js"
import { execSync } from "child_process"

(async () => {
    await DataItems.setItem("PAIRING-SECRET", generateSecret())

    const qrData = 
        await Clients.generateQRData()

    execSync(
        `qrcode '${JSON.stringify(qrData)}' -o ` + 
        `${BASE_PATH}/outputs/pair-qr.png -d 100 -w 300`
    )
    process.exit()
})()