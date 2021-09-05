setInterval(() => {
    chrome.runtime.sendMessage(
        { contentScriptQuery: 'status' },
        status => {
            if (status === 'ended') {
                const s = document.createElement('script')
                s.text = 'nextVideo()'
                document.head.append(s)
                s.remove()
                chrome.runtime.sendMessage(
                    { contentScriptQuery: 'start' },
                    status => {}
                )
            }
        }
    )
}, 1000)