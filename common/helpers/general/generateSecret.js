/**
 * generateSecret.js
 */

const Chance = require("chance")

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
        chars  = DEFAULT_SECRET_CHARS, 
        chance = new Chance()
    }
) {
    let secret = "" 
    for(let i = 0; i < length; i++) {
        const randomIndex = 
            chance.random({ min: 0, max: chars.length - 1 })
        secret += chars[randomIndex]
    }
    return secret 
}   /** 
* QUICK-TESTS
* 
* This is just a small project. These mini tests might do.
*/
import assert from "assert"
import detectBrowser, { BROWSER_CHAIN } from "../common/helpers/general/detectBrowser.js"
import displayImage from "../common/helpers/general/displayImage.js";

function testHelpers () {
   
   // test detectBrowser()
   function testDetectBrowser() {
       for(let browserName of BROWSER_CHAIN) {
           assert(detectBrowser("... " + browserName + " ...") == browserName)
       }
       console.log("@ Passed all tests for helper: detectBrowser()")
   }

   // test displayImage()
   function testDisplayImage() {
       
   }

   console.log("@ Passed all tests for helper: detectBrowser()")
   
}

function main() {
   testHelpers()
}

main()