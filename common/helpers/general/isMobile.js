/** 
 * .isMobile.js 
 */

/** 
 * Detect whether a user agent is a mobile device or not. 
 */
export default function isMobile(userAgent) {
    const isMobile = {
        Android: function() {
            return userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return (
                userAgent.match(/IEMobile/i) || 
                userAgent.match(/WPDesktop/i)
            )
        },
        any: function() {
            return (
                isMobile.Android() || 
                isMobile.BlackBerry() || 
                isMobile.iOS() || 
                isMobile.Opera() || 
                isMobile.Windows()
            );
        }
    };

    return isMobile.any() != null;
}