const fs = require('fs')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const gachiList = fs.readFileSync('gachi-list.html', 'utf8')
const todoList = fs.readFileSync('todo-list.html', 'utf8')
const index = fs.readFileSync('src/index.html', 'utf8')

const gachiDOM = new JSDOM(gachiList)
const todoDOM = new JSDOM(todoList)
const indexDOM = new JSDOM(index)

const gachiHTML = gachiDOM.window.document.querySelector('tbody').innerHTML
const todoHTML = todoDOM.window.document.querySelector('tbody').innerHTML

indexDOM.window.document.querySelector('#table > tbody').innerHTML = gachiHTML + todoHTML

indexDOM.window.document.querySelectorAll('[src="/public/img/youtube-logo.png"]').forEach(e => e.src = 'images/youtube-logo.png')

fs.writeFileSync('src/index.html', '<!DOCTYPE html>' + indexDOM.window.document.documentElement.outerHTML)