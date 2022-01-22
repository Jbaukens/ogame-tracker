// Chrome currently shuts down the background service worker about every 5 minutes even if there are active ports.
// The service worker stays shut down even if new ports try to connect.
// Thus this script opens a new port 60s to keep the service worker alive as long as an OGame page is open.

let port = chrome.runtime.connect();
function renew() {
    port.disconnect();
    port = chrome.runtime.connect();
}

setTimeout(() => renew(), 60 * 1000);