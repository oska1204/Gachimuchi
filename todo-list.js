const fs = require('fs')
const fetch = require('node-fetch')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

fetch('https://supinic.com/track/todo/list')
    .then(e => e.text())
    .then(html => fs.writeFileSync(__dirname + '\\todo-list.html', html))

console.log(__dirname + '\\todo-list.html')