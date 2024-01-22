/** 
 * execute.js 
 * 
 * Description: 
 *  Execute another command via shell script.
 */
import { exec, spawn } from "child_process"

// export default async function execute(...args) {
//     return new Promise((resolve, reject) => {
//         const ls = spawn(...args);

//         ls.stdout.on('data', (data) => {
//             console.log(`${data}`);
//         });

//         ls.stderr.on('data', (data) => {
//             throw data.toString()
//             reject()
//         });

//         ls.on('close', () => {
//             resolve(true)
//         }); 
//     })
// } 

export default function execute(arg) {
    exec(arg, (error, stdout, stderr) => {
        console.log(stdout) 
        console.log(stderr)
        if(error) {
            console.log(error)
        }
    }) 
}