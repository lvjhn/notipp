console.log("Hello, from sw.js...")

setInterval(function(){
    fetch('/ping.txt')
}, 20000)