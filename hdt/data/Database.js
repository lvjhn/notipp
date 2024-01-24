/** 
 * Database.js 
 * 
 * Description: 
 *  Database class for accessing main database connection and creating
 *  tables in the database. 
 */
import knex from "knex"
import { BASE_PATH } from "notipp"
import fs from "fs"

export const DATABASE_PATH = 
    BASE_PATH + "/hdt/data/database/notipp.db";

export default class Database 
{
/**
     * Create connection.
     */
    static connection = knex({
        client: "sqlite3",
        connection: {
            filename: DATABASE_PATH,
        },
        useNullAsDefault: true
    })

    /** 
     * Database setup function.
     */
    static async setup() {
        await Database.clearDatabase()
        await Database.createBlankDatabase()
        await Database.populateInitialData()
    }

    /** 
     * Create blank database. 
     */
    static async createBlankDatabase() {
        await Database.createClientsTable() 
        await Database.createNotificationsTable() 
        await Database.createDataItemsTable()
    }

    /**
     * Clear database.
     */
    static async clearDatabase() {
        const conn = Database.connection
        await conn.schema.dropTableIfExists("Clients")
        await conn.schema.dropTableIfExists("Notifications")
        await conn.schema.dropTableIfExists("DataItems")
    }

    /**
     * Create Clients table. 
     */
    static async createClientsTable() {
        const conn = Database.connection
        await conn.schema.createTable("Clients", (table) => {
            table.string("id").primary() 
            table.string("name").notNullable()
            table.string("secret").notNullable()
            table.string("userAgent").notNullable()
            table.boolean("isPaired").notNullable()
        });
    }

    /**
     * Create Notifications table. 
     */
    static async createNotificationsTable() {
        const conn = Database.connection
        await conn.schema.createTable("Notifications", (table) => {
            table.bigIncrements()
            table.string("data").notNullable() 
            table.string("createdAt").notNullable() 
        })
    }

    /** 
     * Create DataItems table.
     */
    static async createDataItemsTable() {
        const conn = Database.connection
        await conn.schema.createTable("DataItems", (table) => {
            table.string("key").primary().notNullable()
            table.string("value").notNullable()
        })
    }

    /**
     * Populate initial data of the database.
     */
    static async populateInitialData() {
        // [TODO] code to generate pairing secret (using Core)
    }
}
