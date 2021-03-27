const express = require('express')
const youtubedl = require('youtube-dl')
const { execSync, exec } = require('child_process')
const fs = require('fs')
let config = require('./default.config.js')
try {
    config = {
        ...config,
        ...require('./config'),
    }
} catch (error) {
}

const { 
    autoOpenBrowser,
    chromeDefault,
    chromeIncognito,
    proxy, 
    proxyEnabled,
} = config

fs.stat('node_modules/youtube-dl/bin/youtube-dl.exe', function (err, stats) {
    const curTime = Date.now()
    const modTime = stats.mtimeMs
    const diffTimeMs = curTime - modTime
    const diffTimeSec = diffTimeMs / 1000
    const diffTimeSecFloored = Math.floor(diffTimeSec)
    const hour = 3600
    if (diffTimeSecFloored > hour * 5) {
        exec('node node_modules/youtube-dl/scripts/download')
    }
})

const app = express()
const port = 3000
let id = 0

app.post('/', (req, res) => {
    const searchParams = new URLSearchParams(req._parsedUrl.search)
    const url = searchParams.get('url')
    if (id > 1000000)
        id = 0
    const uniqId = ++id
    exec(`"node_modules/youtube-dl/bin/youtube-dl" -j ${proxy && proxyEnabled ? `--proxy "${proxy}"` : ''} "${url}"`, function (err, out) {
        if (uniqId !== id)
            res.end('"new request"')
        if (err)
            res.end('"old"')
        let json = {}
        try {
            json = JSON.parse(out)
        } catch (error) {
        }
        const obj = {
            videos: [],
            audios: [],
            thumbnail: '',
            ext: json.ext,
            thumbnail: json.thumbnail,
        }
        try {
            if (json.extractor === 'youtube') {
                let [a, v] = json.requested_formats
                if (a.acodec === 'none')
                    [v, a] = [a, v]
                obj.name = 'youtube'
                obj.audios.push(a.fragment_base_url, a.url)
                obj.videos.push(v.fragment_base_url, v.url)
                const audios = []
                const videos = []
                json.formats.forEach(e => {
                    if (e.acodec !== 'none') {
                        audios.push(e)
                    } else if (e.vcodec !== 'none') {
                        videos.push(e)
                    }
                })
                const audiosSorted = audios.sort((a, b) => b.abr - a.abr)
                const videosSorted = videos.sort((a, b) => b.tbr - a.tbr)
                audiosSorted.forEach(e => obj.audios.push(e.fragment_base_url, e.url))
                videosSorted.forEach(e => obj.videos.push(e.fragment_base_url, e.url))
                res.end(JSON.stringify(obj))
            }
        } catch (error) {
        }
        try {
            try {
                json.requested_formats.forEach(e => {
                    if (e.acodec === 'none')
                        return
                    res.type('json')
                    obj.audios.push(e.fragment_base_url, e.url)
                })
            } catch (error) {
            }
            let highest = json.formats[0]
            json.formats.forEach(e => {
                if (e.abr && e.abr >= highest.abr)
                    highest = e
            })
            obj.audios.push(highest.fragment_base_url, highest.url)
        } catch (error) {
        }
        res.end(JSON.stringify(obj))
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.static('dist'))


if (autoOpenBrowser) {
    if (chromeDefault) {
        try {
            execSync(`start chrome ${chromeIncognito ? '-incognito' : ''} http://localhost:3000`)
        } catch (error) {
            execSync('start http://127.0.0.1:3000')
        }
    } else {
        try {
            execSync('start http://127.0.0.1:3000')
        } catch (error) {
        }
    }
}
