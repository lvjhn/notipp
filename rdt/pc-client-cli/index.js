#!/usr/bin/env node 

/** 
 * NOTIPP-CLIENT.CLI
 * 
 * Description: 
 *  CLI utility tool for notipp-client.
 */
import { Command, program } from "commander"
import CommandHandlers from "./modules/CommandHandlers.js";
import GeneralInfo from "../../hdt/core/modules/GeneralInfo.js";
import App from "../common/App.js"

(async () => {
    /**
     * Define program.
     */
    program
        .name("notipp-client")
        .description("CLI utility tool for notipp-client") 
        .version(await GeneralInfo.getNotippVersion()) 

    
    /**
     * Load App
     */
    await App.init()
        
    /**
     * Create commands.
     */
    program
        .command("info")
        .description("shows client's current info")
        .option("-p, --private", "Whether to show private data") 
        .action(CommandHandlers.handleInfo)

    program 
        .command("servers")
        .description("shows currently added servers")
        .option(
            "-d, --offline",
            "show offline servers only"
        )
        .option(
            "-u, ---online",
            "show online servers only"
        )
        .option(
            "-t, --unpaired", 
            "show unpaired servers only"
        )
        .action(CommandHandlers.handleServers)
    
    program
        .command("add:server") 
        .description("adds a new server to the client") 
        .option(
            "-i, --ip <ip<", 
            "the ip of the server to add"
        )
        .option(
            "-p, --port <port>", 
            "the port of the server to add"
        )
        .action(CommandHandlers.handleAddServer)

    program
        .command("update:server") 
        .description("updates a server") 
        .argument(
            "[identifier]", 
            "the name of the server to remove"
        )
        .option(
            "-i, --by-id",  
            "specifies that the identifier should be the server's ID"
        )
        .option(
            "-i, --ip <ip>", 
            "the ip of the server to add"
        )
        .option(
            "-p, --port <port>", 
            "the port of the server to add"
        )
        .action(CommandHandlers.handleUpdateServer)
            
    program 
        .command("remove:server") 
        .description("removes a server from the client") 
        .argument(
            "[identifier]", 
            "the name of the server to remove"
        )
        .option(
            "-i, --by-id",  
            "specifies that the identifier should be the server's ID"
        )
        .action(CommandHandlers.handleRemoveServer)

    program 
        .command("change:name <name>") 
        .description("change client name") 
        .argument("[name]", "the new name of the client")
        .action(CommandHandlers.handleChangeName)

    program 
        .command("config") 
        .description("show the config. of the current client") 
        .action(CommandHandlers.handleConfig)

    program 
        .command("config:set") 
        .description("sets a configuration value")
        .option(
            "-k, --key <key>", 
            "the key to set"
        )
        .option(
            "-v, --value <value>", 
            "the value of the key to set"
        )
        .action(CommandHandlers.handleConfigSet)
    
    program 
        .command("turn:on") 
        .description("enables alerts (pop-up) notifications" )
        .action(CommandHandlers.handleTurnOn)

    program 
        .command("turn:off") 
        .description("disables alerts (pop-up) notifications" )
        .action(CommandHandlers.handleTurnOff)
    
    program 
        .command("is:on") 
        .description("checks if client (receiver) is enabled" )
        .action(CommandHandlers.handleIsOn)
        
    program 
        .command("notifs") 
        .description("shows notifications from a specified server") 
        .argument("[identifier]", "name or id of the server to visit")
        .option(
            "-i, --by-id", 
            "specified that the identifier should be the server's ID" 
        )
        .action(CommandHandlers.handleNotifs)

    program 
        .command("clear:data") 
        .description("clears the application's data") 
        .action(CommandHandlers.handleClearData)
     
    /**
     * Parse program.
     */
    program.parse(process.argv)
})();