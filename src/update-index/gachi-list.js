const fs = require('fs')
const fetch = require('node-fetch')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function gachiListFetch() {
    console.log(__dirname + '\\gachi-list.html')
    await fetch('https://supinic.com/track/gachi/list')
        .then(e => e.text())
        .then(html => fs.writeFileSync(__dirname + '\\gachi-list.html', html))
}

module.exports = { gachiListFetch }
