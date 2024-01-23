/** 
 * ip-list.js 
 * 
 * Description: 
 *  Generates list of IP's for WLAN: 192.168.0.X and 192.168.1.X
 */

let ips = [
    "DNS:localhost", 
    "IP:127.0.0.1",
    "IP:0.0.0.0"
] 

for(let i = 0; i < 2; i++) {
    for(let j = 0; j < 255; j++) {
        ips.push(`IP:192.168.${i}.${j}`)
    }
}
console.log(ips.join(","))