/**
 * Notifications Module
 */

import Queries from "./Queries.js";

export default class Notifications 
{
    /**
     * Emit a notification.
     */
    static async emitNotification(data) {

    }

    /** 
     * Quick search 
     */
    static async generalSearch({ 
        query, jumpToDate, perPage, cursor, modifier
    }) {

        // get date string
        let dateString; 
        if(jumpToDate) {
            const dateTokens = jumpToDate.split("/").map(x => parseInt(x))
            dateTokens[0] -= 1
            const date = new Date(dateTokens[2], dateTokens[0], dateTokens[1])
            dateString = date.toISOString() 
        }


        // run query 
        const results = 
            await Queries.search("Notifications", {
                query: query,
                queryFields: ["data"],
                perPage: perPage, 
                cursor: cursor,
                cursorModifier: (cursor, qb) => {
                    if(cursor >= 0 && modifier == "before") {
                        qb = qb.where("id", "<", cursor)
                    }
                    else if (cursor >= 0 && modifier == "after") {
                        qb = qb.where("id", ">", cursor)
                    }
                    return qb
                },
                modifier: (qb) => {
                    if(dateString) {
                        if(modifier == "before") {
                            qb = qb.whereRaw(
                                (
                                    'strftime("%s", ??)' +
                                    ' <' +
                                    'strftime("%s", ?)'
                                ), 
                                ['createdAt', dateString]
                            )
                            qb = qb.orderByRaw('strftime("%s", createdAt) DESC')
                        }
                        if(modifier =="after") {
                            qb = qb.whereRaw(
                                (
                                    'strftime("%s", ??)' +
                                    ' >' +
                                    'strftime("%s", ?)'
                                ), 
                                ['createdAt', dateString]
                            )
                            qb = qb.orderByRaw('strftime("%s", createdAt) ASC')
                        }
                    }
                    
                    if(modifier == "before") {
                        qb = qb.orderByRaw('strftime("%s", createdAt) DESC')
                    } 
                    else if(modifier == "after") {
                        qb = qb.orderByRaw('strftime("%s", createdAt) ASC')
                    }
                    return qb
                }
            }) 

        return results 
    }
}