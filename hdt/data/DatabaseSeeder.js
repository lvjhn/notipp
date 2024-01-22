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

const chance = new Chance()

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

        for(let i = 0; i < 100; i++) {
            await Clients.insert({
                id: crypto.randomUUID(),
                name: generateDeviceName(), 
                secret: generateSecret(), 
                userAgent: randomUserAgent.getRandom(), 
                isPaired: chance.pickone([true, false])
            })
        }
    }

    static async seedNotificationsTable() {
        console.log("@ Seeding notifications table...")

        const Notifications = Database.connection("Notifications")

        await Database.connection("Notifications").del()

        for(let i = 0; i < 100; i++) {
            await Notifications.insert({
                data: JSON.stringify({
                    title: chance.sentence({ words: 5 }), 
                    options: {
                        body: chance.paragraph({ sentences: 5 })
                    }
                }),
                createdAt: chance.date({
                    year: chance.pickone([ 2021, 2022, 2023, 2024 ])
                }).toISOString()
            })
        }
    }

    static async seedDataItemsTable() {
        console.log("@ Seeding data items table...")
    }
}