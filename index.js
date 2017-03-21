const validUrl = require('valid-url');
const url = require('url');
const express = require('express');
const getOriginalUrl = require('./dbactions').getOriginalUrl;
const insertUrl = require('./dbactions').insertNewShortenedUrl;

const app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
    res.end('index.html');
});

// redirect user to original url
app.get('/short/:url', (req, res) => {
    // using promises to wait till query is done
    var p = getOriginalUrl(req.params.url);
	p.then((originalUrl) => res.redirect(originalUrl));
    p.catch((err) => res.end('Invalid shortened URL address'));
});

// shorten url
app.get('/shorten/*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const urlToShorten = parsedUrl.pathname.substring(9);

    var output;
    // check if passed url is valid (http or https)
    if(validUrl.isWebUri(urlToShorten)) {
        const shortUrlId = shortenUrl(parsedUrl);
        const shortUrl = 'localhost:8080/short/' + shortUrlId;
        output = {original_url: urlToShorten, short_url: shortUrl};

        insertUrl(shortUrlId, urlToShorten);
    } else {
        output = {error: 'Invalid URL address'};
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(output));
});


app.listen(app.get('port'));

function shortenUrl(url) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var shortUrl = '';

    for(var i = 0; i < 4; i++ ) {
        shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return shortUrl;
}
