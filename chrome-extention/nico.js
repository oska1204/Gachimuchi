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
    let date = Date.now()
    const next = () => {
        chrome.runtime.sendMessage(
            { contentScriptQuery: 'ended' },
            status => { }
        )
    }

    const playFn = () => {
        date = Date.now() + v.currentTime
    }
    v.addEventListener('play', playFn)

    v.addEventListener('timeupdate', e => {
        const amount = (v.duration * 1000 + date) - Date.now()
        if (amount < 0)
            next()
    })

    v.addEventListener('ended', next)
}