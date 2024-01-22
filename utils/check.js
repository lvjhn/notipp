import DataItems from "../hdt/data/DataItems.js"


(async () => {  
    await DataItems.setItem("foo1", "bar" + (new Date()).getTime())
    await DataItems.setItem("foo2", "bar" + (new Date()).getTime())


    process.exit()
})()