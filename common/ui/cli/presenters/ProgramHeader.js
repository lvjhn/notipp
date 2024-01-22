/** 
 * ProgramHeader
 */
import colors from "colors"

export default function ProgramHeader(name, version) {
    const titleLine = 
        (name + " v" + version).bold 
    const subtitleLine = 
        (process.argv[1].split("/").at(-1) + 
         " " +  
         process.argv.slice(2,).join(" ")).italic.grey

    return (
        titleLine + "\n" + 
        subtitleLine 
    )
}