/**
 * readableDate.js 
 * 
 * Description: 
 *  Reformats items from date to a readable date/ 
 */

const MONTHS = [
    "Jan",
    "Feb",
    "Mar", 
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct", 
    "Nov",
    "Dec"
]

export default function readableDate(date) {
    const month = date.getMonth() 
    const day = date.getDate() 
    const year = date.getFullYear()
    
    return {
        items: { month, day, year }, 
        dateString: `${MONTHS[month]}. ${day}, ${year}`, 
        timeString: date.toLocaleTimeString()
    }
}
