export default function requestNotificationPermission() {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
         alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        
    } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
      
            }

        });
    }
}