/** 
 * displayImage.js
 */
import childProcess from "child_process"

/*
 * Description: 
 *  Display an image using the systems display command. 
 */
export default function displayImage(
    imageSrc
) {
    childProcess.execSync(`display "${imageSrc}"`)  
}