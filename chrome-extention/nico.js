setTimeout(() => {
    document.querySelector('.unplayed div').click()
}, 1000)

const realVideo = setInterval(()=>{
    if (document.querySelector('video').hasAttribute('src')) {
        start()
        clearInterval(realVideo)
    }
}, 100)

function start() {
    const v = document.querySelector('video')
    let date
    const next = () => {
        chrome.runtime.sendMessage(
            { contentScriptQuery: 'ended' },
            status => { }
        )
    }

    const playFn = () => {
        date = Date.now()
        v.removeEventListener('play', playFn)
    }
    v.addEventListener('play', playFn)

    v.addEventListener('timeupdate', e => {
        const amount = (v.duration * 1000 + date) - Date.now()
        if (amount < 0)
            next()
    })

    v.addEventListener('ended', next)
}