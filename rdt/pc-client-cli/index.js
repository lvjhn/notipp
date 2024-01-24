#!/usr/bin/env node 

/** 
 * NOTIPP-CLIENT.CLI
 * 
 * Description: 
 *  CLI utility tool for notipp-client.
 */
import { Command, program } from "commander"
import CommandHandlers from "./modules/CommandHandlers.js";
import Core from "../../hdt/core/Core.js";

(async () => {
    /**
     * Define program.
     */
    program
        .name("notipp-client")
        .description("CLI utility tool for notipp-client") 
        .version(await Core.GeneralInfo.getNotippVersion()) 
        
    /**
     * Create commands.
     */
    program 
        .command("servers")
        .description("shows currently added servers")
        .option(
            "--offline",
            "show offline servers only"
        )
        .option(
            "--online",
            "show online servers only"
        )
        .option(
            "--unpaired", 
            "show unpaired servers only"
        )
        .action(CommandHandlers.handleServers)
    
    program
        .command("add:server") 
        .description("adds a new server to the client") 
        .option(
            "-i, --ip", 
            "the ip of the server to add"
        )
        .option(
            "-p, --port", 
            "the port of the server to add"
        )
        .action(CommandHandlers.handleAddServer)
            
    program 
        .command("remove:server") 
        .description("removes a server from the client") 
        .argument(
            "<identifier>", 
            "the name of the server to remove"
        )
        .option(
            "-i, --by-id",  
            "specifies that the identifier should be the server's ID"
        )
        .action(CommandHandlers.handleRemoveServer)

    program 
        .command("show:settings") 
        .description("show the settings of the current client") 
        .action(CommandHandlers.handleShowSettings)

    program 
        .command("enable:alerts") 
        .description("enables alerts (pop-up) notifications" )
        .action(CommandHandlers.handleEnableAlerts)

    program 
        .command("disable:alerts") 
        .description("disables alerts (pop-up) notifications" )
        .action(CommandHandlers.handleDisableAlerts)
        
    program 
        .command("notifs") 
        .description("shows notifications from a specified server") 
        .argument("<serverName>")
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
    program.parse()
})();