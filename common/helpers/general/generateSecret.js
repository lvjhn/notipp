/**
 * generateSecret.js
 */

import { randomGen } from "../../../index.js"

/** 
 * Generate a random secret given a specified length. 
 */
export const ALPHANUMERIC_CHARS = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
    "abcdefghijklmnopqrstuvwxyz" + 
    "12345667890"

export const SYMBOLS = 
    "~!@#$%^&*()_+`{}[]:\";\',.<>/?" 

export const DEFAULT_SECRET_CHARS = 
    ALPHANUMERIC_CHARS +
    SYMBOLS


export default function generateSecret(
    length = 64, 
    {
        chars  = ALPHANUMERIC_CHARS, 
        chance = randomGen
    } = {}
) {
    let secret = "" 
    for(let i = 0; i < length; i++) {
        const randomIndex = 
            chance.integer({ min: 0, max: chars.length - 1 })
        secret += chars[randomIndex]
    }
    return secret 
}  