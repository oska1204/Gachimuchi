const fs = require('fs')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { gachiListFetch } = require('./gachi-list');
const { todoListFetch } = require('./todo-list');

(async () => {
    await gachiListFetch()
    await todoListFetch()

    const gachiList = fs.readFileSync(`${__dirname}/gachi-list.html`, 'utf8')
    const todoList = fs.readFileSync(`${__dirname}/todo-list.html`, 'utf8')
    const index = fs.readFileSync(`src/index.html`, 'utf8')

    const gachiDOM = new JSDOM(gachiList)
    const todoDOM = new JSDOM(todoList)
    const indexDOM = new JSDOM(index)

    const gachiDocument = gachiDOM.window.document
    const todoDocument = todoDOM.window.document
    const document = indexDOM.window.document

    const trTemplate = document.createElement('template')
    trTemplate.innerHTML = '<td field="🔁"></td>'

    todoDocument.querySelectorAll('[field="Added to list"]').forEach(e => {
        e.parentNode.prepend(trTemplate.content.cloneNode(true))
        e.remove()
    })

    const gachiHTML = gachiDocument.querySelector('tbody').innerHTML
    const todoHTML = todoDocument.querySelector('tbody').innerHTML

    document.querySelector('#table > tbody').innerHTML = gachiHTML + todoHTML

    document.querySelectorAll('[src="/public/img/youtube-logo.png"]').forEach(img => img.src = 'images/youtube-logo.png')

    fs.writeFileSync('src/index.html', '<!DOCTYPE html>' + document.documentElement.outerHTML)
})()
