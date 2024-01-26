/**
 * DatabaseSeeder.js
 * 
 * Description: 
 *  Seeder functions for the database (for dev. purposes only)
 */

import { Chance } from "chance"
import generateDeviceName from "../../common/helpers/general/generateDeviceName.js"
import Database from "./Database.js"
import randomUserAgent from "random-useragent"
import generateSecret from "../../common/helpers/general/generateSecret.js"
import { randomGen } from "../../index.js"

export default class DatabaseSeeder 
{
    static async seed() {
        // faster processing
        await Database.connection.raw(`
            PRAGMA synchronous=OFF;
            PRAGMA count_changes=OFF; 
            PRAGMA journal_mode=MEMORY;
            PRAGMA temp_store=MEMORY;
        `)

        // seed tables
        await DatabaseSeeder.seedClientsTable() 
        await DatabaseSeeder.seedNotificationsTable() 
        await DatabaseSeeder.seedDataItemsTable() 
    }

    static async seedClientsTable() {
        console.log("@ Seeding clients table...")
        
        const Clients = Database.connection("Clients")

        await Database.connection("Clients").del()

        for(let i = 0; i < 20; i++) {
            await Clients.insert({
                id: randomGen.guid(),
                name: generateDeviceName(), 
                secret: generateSecret(), 
                userAgent: randomUserAgent.getRandom(), 
                lastRead: 0,
                isPaired: randomGen.pickone([true, false]),
                isConnected: randomGen.pickone([true, false])
            })
        }
    }

    static async seedNotificationsTable() {
        console.log("@ Seeding notifications table...")

        const Notifications = Database.connection("Notifications")

        await Database.connection("Notifications").del()
        
        let notifs = []

        for(let i = 0; i < 100; i++) {
            notifs.push({
                data: JSON.stringify({
                    title: randomGen.sentence({ words: 5 }), 
                    options: {
                        body: randomGen.paragraph({ sentences: 1 })
                    }
                }),
                createdAt: randomGen.date({
                    year: randomGen.pickone([ 2021, 2022, 2023, 2024 ])
                }).toISOString()
            })
        }

        notifs.sort(
            (a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
        )

        notifs = notifs.map((item, index) => ({ ...item, id: index }))

        for(let i = 0; i < 100; i++) {
            await Notifications.insert(notifs[i])
        }
    }

    static async seedDataItemsTable() {
        console.log("@ Seeding data items table...")
    }
}