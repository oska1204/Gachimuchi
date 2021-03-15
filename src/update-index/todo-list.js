const fs = require('fs')
const fetch = require('node-fetch')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function todoListFetch() {
    console.log(__dirname + '\\todo-list.html')
    await fetch('https://supinic.com/track/todo/list')
        .then(e => e.text())
        .then(html => fs.writeFileSync(__dirname + '\\todo-list.html', html))
}

module.exports = { todoListFetch }
