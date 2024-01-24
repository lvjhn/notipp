/**
 * NotificationsViewer.js
 * 
 * Description: 
 *  Views notifications.  
 */

import { table } from "table"
import readableDate from "../../../helpers/general/readableDate.js"
import prompts from "prompts"

export default class NotificationsViewer {
    static async show(options, fetchFn = () => {}) {
        const query = options.query
        const startDate = options.startDate 
        const modifier = options.modifier 

        async function displayForCursor(cursor) {
            const results = await fetchFn(cursor)
            
            if(results.data.length == 0) {
                console.log("@ Reached end of data... exiting.") 
                process.exit()
            }
            
            // create display table 
            const tableData = [
                [
                    "ID".bold, 
                    "MESSAGE".bold,
                    "CREATED-AT".bold
                ]
            ] 

            for(let notification of results.data) {
                const dateFormatted = 
                    readableDate(new Date(notification.createdAt))

                tableData.push([
                    notification.id.toString().bold, 
                    JSON.parse(notification.data).options.body, 
                    dateFormatted.dateString.bold + "\n" + dateFormatted.timeString
                ])
            }

            const tableConfig = {
                columns: [
                    {},
                    { width: 30, wrapWord: true }
                ]
            }

            return { 
                nextCursor: results.meta.next,
                tableData, 
                tableConfig 
            }
        }

        let cursor;
        
        if(modifier == "before") {
            cursor = Infinity;
        } 
        else if(modifier == "after") {
            cursor = 0
        }

        while(true) {
            const next = await displayForCursor(cursor) 
          
            if(modifier == "before" && next.nextCursor > cursor) {
                console.log("@ End of data, exiting.") 
                process.exit()
            } 
            else if(modifier == "after" && next.nextCursor < cursor) {
                console.log("@ End of data, exiting.") 
                process.exit()
            }
            else {
                console.log(table(next.tableData, next.tableConfig))
            }
              
            const continuePage =    
                await prompts({
                    type: "toggle", 
                    name: "value",
                    message: "Show more?", 
                    active: "yes", 
                    inactive: "no",
                    initial: true
                })

            if(continuePage.value) {
                cursor = next.nextCursor
                continue;
            } else {
                process.exit()
            }
        }
    }
}