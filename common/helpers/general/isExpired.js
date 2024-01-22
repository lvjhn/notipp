/** 
 * isExpires.js 
 */

/**
 * Detect if another is past the current date. 
 */
export default function isExpired(
    targetDate, 
    currentDate = new Date()
) {
    return targetDate > currentDate
}