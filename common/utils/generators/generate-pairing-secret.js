import DataItems from "../../../hdt/data/DataItems.js"
import generateSecret from "../../helpers/general/generateSecret.js"

(async () => {
    await DataItems.setItem("PAIRING-SECRET", generateSecret())
    process.exit()
})()