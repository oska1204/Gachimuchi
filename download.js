var downloader = require('./downloader.js')

downloader(function error (err, done) {
  if (err) return console.log(err.stack)
  console.log(done)
})
