let currentStatus = 'start'
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const query = request.contentScriptQuery
        if (query == 'ended') {
            currentStatus = 'ended'
            sendResponse('')
            return true; // Will respond asynchronously.
        }
        if (query == 'start') {
            currentStatus = 'start'
            sendResponse('')
            return true; // Will respond asynchronously.
        }
        if (query == 'status') {
            sendResponse(currentStatus)
            return true; // Will respond asynchronously.
        }
    }
);