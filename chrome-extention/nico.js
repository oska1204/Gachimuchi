setTimeout(() => {
    document.querySelector('.unplayed div').click()
}, 1000)

const realVideo = setInterval(() => {
    if (document.querySelector('video').duration > 0) {
        start()
        clearInterval(realVideo)
    }
}, 100)

function start() {
    const v = document.querySelector('video')
    const seeked = {};
    const next = () => {
        chrome.runtime.sendMessage(
            { contentScriptQuery: 'ended' },
            status => { }
        )
    }

    v.addEventListener('seeked', e => {
        const num = v.currentTime
        if (seeked[num] === undefined)
            seeked[num] = 0
        seeked[num]++
        if (seeked[num] > 1)
            next()
    })

    v.addEventListener('ended', next)
}