# Gachimuchi
This project tries to make it more accessible to find and listen to unique gachimuchi.

First run this in a command prompt to install
```
npm i
npm run build
```

Then run `myapp.exe` or open a command prompt and run 
```
node app
```
After that open http://127.0.0.1:3000 in a browser (or http://localhost:3000)

## Proxy
You can add a proxy for the youtube-dl request.

Add a `proxy.js` file in the root directory, and write the following code.
```js
module.exports = 'socks5://127.0.0.1:<port>'
```
Now relaunch `myapp.exe`, or close the old `node app`, and start a new.
