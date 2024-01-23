/**
 * generateStrongPassword.js
 */

/**
 * Generates a strong password with letters, numbers, and some symbols. 
 */
import { chance, randomGen } from "../../../index.js"

const CHARACTER_SELECTION =     
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
    "abcdefghijklmnopqrstuvwxyz" + 
    "1234567890" + 
    "!@#$%^&*()_+`[]{};':\",.<>/?"

export default function generateStrongPassword(
    length = 32, 
    { 
        chance = randomGen
    } = {}
) {
    let secret = "" 
    for(let i = 0; i < length; i++) {
        const randomIndex = 
            chance.integer({ min: 0, max: CHARACTER_SELECTION.length - 1 })
        secret += CHARACTER_SELECTION[randomIndex]
    }
    return secret 
}  