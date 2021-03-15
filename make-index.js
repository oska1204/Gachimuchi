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

const document = indexDOM.window.document

document.querySelector('#table > tbody').innerHTML = gachiHTML + todoHTML

document.querySelectorAll('[src="/public/img/youtube-logo.png"]').forEach(img => img.src = 'images/youtube-logo.png')

fs.writeFileSync('src/index.html', '<!DOCTYPE html>' + document.documentElement.outerHTML)