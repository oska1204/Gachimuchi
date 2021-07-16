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

    const trGachi = document.createElement('template')
    const trTodo = document.createElement('template')
    const trFavs = document.createElement('template')
    
    trGachi.innerHTML = '<td field="Added to list"></td>'
    trTodo.innerHTML = '<td field="🔁"></td>'
    trFavs.innerHTML = '<td field="Favs"></td>'

    gachiDocument.querySelectorAll('[field="Author"]').forEach(td=>{
        td.after(trGachi.content.cloneNode(true))
    })

    todoDocument.querySelectorAll('[field="Added to list"]').forEach(td => {
        td.parentNode.prepend(trTodo.content.cloneNode(true))
        td.after(trFavs.content.cloneNode(true))
    })

    const gachiHTML = gachiDocument.querySelector('tbody').innerHTML
    const todoHTML = todoDocument.querySelector('tbody').innerHTML

    document.querySelector('#table > tbody').innerHTML = gachiHTML + todoHTML

    document.querySelectorAll('[src="/public/img/youtube-logo.png"]').forEach(img => img.src = 'images/youtube-logo.png')

    document.querySelectorAll('.searchables').forEach(td=>{
        td.remove()
    })

    fs.writeFileSync('src/index.html', '<!DOCTYPE html>' + document.documentElement.outerHTML)
})()
