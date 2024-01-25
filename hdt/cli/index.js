#!/usr/bin/env node 

/** 
 * NOTIPP-SERVER.CLI
 * 
 * Description: 
 *  CLI utility tool for notipp-server.
 */
import { Command, program } from "commander"
import CommandHandlers from "./modules/CommandHandlers.js";
import GeneralInfo from "../core/modules/GeneralInfo.js";

(async () => {
    /**
     * Define program.
     */
    program
        .name("notipp-server")
        .description("CLI utility tool for notipp-server") 
        .version(await GeneralInfo.getNotippVersion()) 
        
    /**
     * Create commands.
     */

    program 
        .command("info") 
        .description("show information about the server") 
        .option("-p, --private", "whether to show private information or not")
        .action(CommandHandlers.handleInfo)

    program 
        .command("emit:notif") 
        .description("emits notification to clients") 
        .argument("<body>", "message body") 
        .option("-d, --other-details", "other details for the message") 
        .action(CommandHandlers.handleInfo)

    program 
        .command("pair")
        .description("pair a client") 
        .argument(
            "[identifier]", 
            "name (or id) of the client to pair"
        )
        .option(
            "-i, --by-id", 
            "specifies that the identifier should be the client's ID"
        )
        .option(
            "-q, --qr", 
            "displays a QR for pairing a client"
        ) 
        .option(
            "-a, --all", 
            "pairs all unpaired clients"
        )
        .option(
            "-r, --regenerate", 
            "option to regenerate QR code"
            )
        .action(CommandHandlers.handlePair)

    program 
        .command("unpair") 
        .description("unpairs a specified client")
        .argument(
            "[identifier]", 
            "name (or id) of the client to pair"
        )
        .option(
            "-i, --by-id", 
            "specifies that the identifier should be the client's ID"
        ) 
        .option(
            "-a, --all", 
            "unpairs all paired clients"
        )
        .action(CommandHandlers.handleUnpair)

    program 
        .command("remove") 
        .description("unpairs a specified client")
        .argument(
            "[identifier]", 
            "name (or id) of the client to pair"
        )
        .option(
            "-i, --by-id", 
            "specifies that the identifier should be the client's ID"
        ) 
        .option(
            "-a, --all", 
            "unpairs all paired clients"
        )
        .action(CommandHandlers.handleRemove)

    
    program
        .command("show:clients")
        .description("shows clients that are registered in the server") 
        .option(
            "-c, --connected", 
            "show only connected clients"
        )
        .option(
            "-d, --disconnected", 
            "show only disconnected clients"
        )
        .option(
            "-p, --paired", 
            "show only paired clients"
        )
        .option(
            "-u, --unpaired",
            "show only unpaired clients"
        )
        .action(CommandHandlers.handleShowClients)

    program 
        .command("show:notifs") 
        .description("show notifications history") 
        .option(
            "-q, --query <queryString>", 
            "the query string to use"
        ) 
        .option(
            "-s, --start-date <startDate>", 
            "the date to start the search from"
        )
        .option(
            "-m, --modifier <modifier>", 
            "whether start search is 'before' or 'after' the start date"
        )
        .action(CommandHandlers.handleShowNotifs)

    program    
        .command("prune:notifs")
        .description("prune notifications in the database") 
        .option(
            "-m, --modifier <modifier>", 
            "whether pruning is 'before' or 'after' the key date"
        )
        .option(
            "-k, --key-date <keyDate>", 
            "reference date for the modifier"
        )
        .action(CommandHandlers.handlePruneNotifs)

    program 
        .command("config") 
        .description("shows the system's configuration") 
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
        .command("config:unset") 
        .description("unsets a configuration value")
        .option(
            "-k, --key <key>", 
            "the key to unset"
        )
        .action(CommandHandlers.handleConfigUnset)


    program 
        .command("enable")
        .description("enables notipp-server on system startup") 
        .action(CommandHandlers.handleEnable)

    program 
        .command("disable")
        .description("disables notipp-server on system startup")
        .action(CommandHandlers.handleDisable)

    program 
        .command("start") 
        .description("starts notipp-server") 
        .action(CommandHandlers.handleStart)

    program 
        .command("stop") 
        .description("stops notipp-server") 
        .action(CommandHandlers.handleStop)

    program 
        .command("update-certificates")
        .description("updates certificates used by the system") 
        .option(
            "-f, --force", 
            "if used, will continue to update non-expired certificates"
        )
        .action(CommandHandlers.handleUpdateCertificates)

    program
        .command("auto-pair")
        .description("quick shortcut to enable auto-pairing")
        .option(
            "-d, --disable",
            "disables auto-pairing"
        )
        .action(CommandHandlers.handleAutoPair)

    program 
        .command("import:ca") 
        .description("imports/replaces the CA for the current server")
        .option(
            "-k, --keyFile <file>", 
            "absolute path to the key file" 
        )
        .option(
            "-c, --certFile <file>", 
            "absolute for the to cert file"
        )
        .action(CommandHandlers.handleImportCA)

    program 
        .command("base-path") 
        .description("gets path of notipp")
        .action(CommandHandlers.handleBasePath)
        
    /**
     * Parse program.
     */
    program.parse(process.argv)
})();