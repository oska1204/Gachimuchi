const express = require('express')
const youtubedl = require('youtube-dl')
const { execSync } = require('child_process')

const app = express()
const port = 3000
let id = 0

app.post('/', (req, res) => {
    const searchParams = new URLSearchParams(req._parsedUrl.search)
    const url = searchParams.get('url')
    if (id > 1000000)
        id = 0
    const uniqId = ++id
    youtubedl.exec(url, ['-j'], {}, function (err, out) {
        if (uniqId !== id)
            res.end('"new request"')
        if (err)
            res.end('"old"')
        const obj = {}
        obj.videos = []
        obj.audios = []
        obj.thumbnail = ''
        let json
        try {
            json = JSON.parse(out)
        } catch (error) {
        }
        try {
            obj.thumbnail = json.thumbnail
        } catch (error) {
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

app.use(express.static('src'))

// exec('start chrome -incognito http://localhost:3000', function (err, stdout, stderr) {
//     if (err)
//         exec('start http://127.0.0.1:3000', function (err, stdout, stderr) {
//             if (err) {
//                 console.error(err)
//             }
//         })
// })

try {
    execSync('start chromes -incognito http://localhost:3000')
} catch (error) {
    execSync('start http://127.0.0.1:3000')
}
