const app = require('http').createServer(handler);
const request = require('request');
const fs = require('fs');
const host = 'localhost';
const port = 3000;

app.listen(port, host,function() {
    console.log('listen '+ host +':' + port);
});

function handler(req, res) {
    console.log(req.url);
    let urlArr = req.url.split('?');
    switch (urlArr[0]) {
        case '/':
            fs.readFile('./index.html', function(err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Invalid resource path');
                }
                res.writeHead(200);
                res.end(data);
            });
            break;
        case '/song':
            let songOptions = {
                url: 'http://api.xiami.com/web?'+ urlArr[1],
                headers: {
                    'Referer': 'http://m.xiami.com/'
                }
            };
            function callback1(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.end(body);
                }
            }
            request(songOptions, callback1);
            break;
        case'/lyric':
            console.log('init lyric');
            console.log(urlArr[1].split('=')[1]);
            let lyricOptions = {
                url: urlArr[1].split('=')[1],
                headers: {
                    'Referer': 'http://m.xiami.com/',
                    'Content-Type': 'application/octet-stream'
                }
            };
            function callback2(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.setHeader('Content-Type', 'application/text;');
                    console.log(body);
                    res.statusCode = 200;
                    res.end(body);
                }
            }
            request(lyricOptions, callback2);
            break;
        default:
            console.log('mismatching')
    }
}