const sndcld = url => `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"
		src="https://w.soundcloud.com/player/?url=${url}&auto_play=true"></iframe>`
const ytbe = url => `<iframe src="https://www.youtube.com/embed/${url.slice(url.lastIndexOf('/') + 1)}?autoplay=1"></iframe>`
const blbl = url => `<iframe src="https://player.bilibili.com/player.html?aid=${url.slice(url.lastIndexOf('av') + 2)}&autoplay=1"></iframe>`


const urls = Array.from(document.querySelectorAll('[field="Name"] a'))
let v = document.querySelector('#video')
let a = document.querySelector('#audio')
const vp = document.querySelector('.video-player')
v.addEventListener('play', () => {
    syncVideo()
})
v.addEventListener('timeupdate', () => {
    if (v.currentTime > a.currentTime + 2 || v.currentTime < a.currentTime - 3)
        syncVideo()
    else if (v.currentTime > a.currentTime + .2)
        v.playbackRate = .9
    else if (v.currentTime < a.currentTime - .2)
        v.playbackRate = 1.1
    else
        v.playbackRate = 1
})
a.addEventListener('ended', () => enrollPause())
a.addEventListener('suspended', () => enrollPause())
a.addEventListener('waiting', () => setTimeout(() => enrollPause(undefined, 9000), 1000))
a.addEventListener('error', () => setTimeout(() => enrollPause(undefined, 9000), 1000))
a.addEventListener('timeupdate', () => clearTimeout(cancel))
a.addEventListener('pause', () => {
    syncVideo()
    v.pause()
})
a.addEventListener('play', () => {
    syncVideo()
    v.play()
})
a.volume = .4
const c = document.querySelector('[type="checkbox"]')
const queue = []
let links = []
let videos = []
let past = 0
let index = 0
let currentSong = 0
index = urls.indexOf(randomVideoUrl())
function randomVideo() {
    nextVideo(randomVideoUrl())
}
function randomVideoUrl() {
    const rnd = Math.floor(Math.random() * urls.length)
    // const time = parseInt(Date.now() / 1000)
    // const rnd = parseInt(time.toString() + index) % urls.length
    // console.log(time, new Date(time * 1000), time.toString() + index, index, rnd, urls[rnd])
    return urls[rnd]
}
const text = document.querySelector('.text')
async function nextVideo(reqUrl = '') {
    vp.hidden = false
    links = []
    videos = []
    a.pause()
    v.pause()
    let queueUrl = false
    let rndUrl
    clearTimeout(cancel)
    if (!reqUrl) {
        const item = queue.shift()
        reqUrl = item
        if (item)
            queueUrl = true
        else
            rndUrl = c.checked ? randomVideoUrl() : urls[++index] || urls[0]
    }
    let url = (reqUrl || rndUrl)
    if (!queueUrl)
        index = urls.indexOf(url)
    currentSong = urls.indexOf(url)
    text.current = url
    try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: url.textContent.replace(/(\n|\t)+/g, ' ') })
    } catch { }
    text.innerHTML = `<p>Name: ${url.outerHTML}</p><p>Published ${url.parentNode.parentNode.querySelector('[field="Published"]').innerHTML}</p><p>Author: ${url.parentNode.parentNode.querySelector('[field="Author"]').innerHTML}</p><p>ID: ${url.parentNode.parentNode.querySelector('[field="ID"]').innerHTML}</p>`
    console.log(Array.from(document.querySelector('.text').children).map((e, i) => i ? e.textContent : e.textContent.replace(/\n/, ' ').replace(/\t*/g, '') + '	' + e.firstElementChild.href).join('\n'))
    let old
    if (!url.href.match(/https?:\/\/(.*?\.)?youtu(\.be|be\.com)\//)) {
        old = url.href
        try {
            url = 'supinic.com' + url.parentElement.parentElement.querySelector('[field="🔁"]').firstElementChild.getAttribute('href') || url.href
        } catch (error) {
        }
    }
    else
        url = url.href
    if (!url) {
        url = old
        old = null
    }
    clearTimeout(cancel)
    let response = await fetch('?url=' + url, { method: 'post' })
    let json = await response.json()
    clearTimeout(cancel)
    if (json === 'old' && old) {
        response = await fetch('?url=' + old, { method: 'post' })
        json = await response.json()
    }
    try {
        links.push(...json.audios)
    } catch (error) {
    }
    try {
        videos.push(...json.videos)
    } catch (error) {
    }
    videos = videos.filter(e => e)
    links = links.filter(e => e)
    const pause = (elm) => {
        elm.pause()
        elm.innerHTML = ''
        elm.load()
    }
    pause(a)
    pause(v)
    const sourceElms = (elm, srcs) => {
        srcs.forEach(src => {
            const source = document.createElement('source')
            source.src = src
            elm.append(source)
        })
    }
    sourceElms(a, links)
    sourceElms(v, videos)
    a.poster = json.thumbnail
    a.load()
    v.load()
    a.play()
}
const prevVideo = function () {
    index === 0
        ? index = urls.length - 1
        : index--
    nextVideo(urls[index])
}
try {
    navigator.mediaSession.setActionHandler('nexttrack', () => nextVideo());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevVideo());
} catch { }
// a.addEventListener('error', () => {
// 	enrollPause(() => {
// 		if (links.length > 0)
// 			a.src = links.shift()
// 		else
// 			enrollPause()
// 	}, 500)
// })
// let cancelVideo
// const checkVideo = () => {
// 	if (videos.length > 0) {
// 		v.src = videos.shift()
// 		v.play()
// 	}
// }
// v.addEventListener('error', () => {
// 	clearTimeout(cancelVideo)
// 	cancelVideo = setTimeout(checkVideo, 500)
// })
// v.addEventListener('pause', () => {
// 	clearTimeout(cancelVideo)
// 	if (!a.paused)
// 		cancelVideo = setTimeout(checkVideo, 500)
// })
// v.addEventListener('timeupdate', () => clearTimeout(cancelVideo))
document.addEventListener('click', e => {
    const openSupinic = (elm) => {
        const href = elm.getAttribute('href') || ''
        if (href.match(/^\/track\//)) {
            e.preventDefault()
            open('https://supinic.com' + href)
        }
    }
    openSupinic(e.target)
    openSupinic(e.target.parentElement)
    try {
        if (e.target.parentElement.getAttribute('field') === 'Name') {
            e.preventDefault()
            if (!e.altKey)
                nextVideo(e.target)
            else
                queue.push(e.target)
        }
    } catch (error) {

    }
})
document.body.style.display = ''
let cancel
function enrollPause(func = nextVideo, time = 1000) {
    clearTimeout(cancel)
    cancel = setTimeout(() => {
        func()
    }, time)
}
let compensate = 0
const syncVideo = () => {
    v.currentTime = a.currentTime + compensate
    setTimeout(() => {
        compensate += a.currentTime - v.currentTime
        v.currentTime = a.currentTime + compensate
    }, 1000)
}
document.addEventListener('visibilitychange', () => {
    a.paused ? v.pause() : v.play()
    if (document.visibilityState === 'visible')
        syncVideo()
})
let ti
vp.addEventListener('mousemove', (e) => {
    const elm = e.target
    clearTimeout(ti)
    a.classList.add('cursor')
    a.controls = true
    ti = setTimeout(() => {
        a.classList.remove('cursor')
        a.controls = false
    }, 1000)
})
vp.addEventListener('mouseleave', () => {
    a.controls = false
})
a.addEventListener('input', () => clearTimeout(ti))
v.addEventListener('input', () => clearTimeout(ti))