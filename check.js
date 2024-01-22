
import FileStorage from "./common/helpers/file-storage/FileStorage.js"

(async () => {
    const fss = new FileStorage() 
    await fss.setContext("main")
    await fss.clear()
})()