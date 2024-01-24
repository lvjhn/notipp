/**
 * DatabaseTable Module
 */

import Database from "../../data/Database.js";

export default class Queries 
{
    constructor() {
        this.table = null;
    }   

    /**
     * Factory creator.
     */
    static async from(tableName) {
        const databaseTable = new DatabaseTable() 
        databaseTable.table = Database.connection(tableName)
        return table 
    }

    /** 
     * Search data. 
     */
    static async search(tableName, {
        query = "",
        queryFields = [],
        perPage = 10,
        cursor = -1, 
        cursorModifier = (cursor, qb) => {
            qb.where("id", "!=", cursor) 
            return qb 
        },
        nextCursorModifier = (data, qb) =>{ 
            return data.at(-1).id
        },
        modifier = (qb) => {
            return qb
        }
    } = {}) {
        let qb = Database.connection(tableName) 
        let metaQb = Database.connection(tableName)
        
        
        for(let i = 0; i < queryFields.length; i++) {
            const field = queryFields[i]
            if(i == 0) {
                qb = qb.whereLike(field, query);
                metaQb = metaQb.whereLike(field, query)
            } else {
                qb = qb.orWhereLike(field, query)
                metaQb = metaQb.whereLike(field, query)
            }
        }

        qb = cursorModifier(cursor, qb)
        metaQb = cursorModifier(cursor, metaQb)
        
        qb = modifier(qb) 
        metaQb = modifier(metaQb)

        qb = qb.limit(perPage)

        metaQb = metaQb.count('id as count')

        const results = {
            meta : (await metaQb)[0],
            data : await qb
        }

        results.meta.next = nextCursorModifier(results.data, qb)

        return results
    } 

    static async prune(tableName, keyDate, {
        modifier = "before",        
        modifierField = "createdAt",
        customModifier = null
    } = {}) {
        let qb = Database.connection(tableName)

        const keyDateStr = keyDate.toISOString()
        
        if(customModifier != null) {
            qb = qb.customModifier() 
        }
        else {
            if(modifier == "before") {
                qb = qb.whereRaw(
                    (
                        'strftime("%s", ??)' +
                        ' < ' +
                        'strftime("%s", ?)'
                    ), 
                    ['createdAt', keyDateStr]
                )
            }
            else if(modifier == "after") {
                qb = qb.whereRaw(
                    (
                        'strftime("%s", ??)' +
                        ' >' +
                        'strftime("%s", ?)'
                    ), 
                    ['createdAt', keyDateStr]
                )
            }
        }

        qb = qb.del() 

        await qb
    }

    /** 
     * Check for existence. 
     */
    static async exists(tableName, modifier) {
        const query = Database.connection(tableName) 
        modifier(query) 
        query.limit(1) 
        const results = await query;
        return results.length > 0;
    }
}