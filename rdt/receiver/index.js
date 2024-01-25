import SimpleEventBus from "../../common/helpers/simple-event-bus/SimpleEventBus.js";
import Config from "../../hdt/core/modules/Config.js";

// create event bus
const ebPort = (await Config.getConfig()).client.eventBusPort;
const eb = new SimpleEventBus("127.0.0.1", ebPort, {
    onListen: () => {
        console.log("@ Server bus is listening on port no: " + ebPort)
    }
}) 

eb.host()

// listen for messages 
eb.connect()
eb.subscribe((message) => {
    console.log(message)
})
