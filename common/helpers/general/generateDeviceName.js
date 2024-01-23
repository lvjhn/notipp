/** 
 * generateDeviceName.js
 */
import Chance from "chance"
import capitalize from "./capitalize.js";
import { randomGen } from "../../../index.js";

/*
 * Description: 
 *  Generate a random device name follow the format <word>-<number>    
 */
export default function generateDeviceName(
    chance = randomGen
) {
    const word = 
        capitalize(chance.word()); 
    const number = 
        chance.integer({min : 0, max: 999}).toString().padStart(4, "0") 
    const name = 
        word + "-" + number; 
    return name 
}

