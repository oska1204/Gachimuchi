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

## Config
Make a copy of `default.config.js` and rename it to `config.js`.

Changes require you to relaunch `myapp.exe`, or close the old `node app`, and start a new.

## Install extention
The extention allows you to autoplay niconico videos, and know when the video ended.
1. Go to `chrome://extensions`
2. Enable developer mode (top right)
3. Load unpacked (top left)
4. Navigate to the project folder
5. Select the "chrome-extention" folder

The extension is called gachimuchi. If you use incognito. Click on the card, scroll down and enable "Allow in incognito".

Any updates to the extension you'll need to press the update button in `chrome://extensions`.

### Proxy
You can add a proxy for the youtube-dl request.

```js
proxy: 'socks5://127.0.0.1:<port>'
```
