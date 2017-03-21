const validUrl = require('valid-url');
const url = require('url');
const express = require('express');
const getOriginalUrl = require('./dbactions').getOriginalUrl;
const insertUrl = require('./dbactions').insertNewShortenedUrl;

const app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.render('index');
});

// redirect user to original url
app.get('/:url', (req, res) => {
    // using promises to wait till query is done
    var p = getOriginalUrl(req.params.url);
	p.then((originalUrl) => res.redirect(originalUrl));
    p.catch((err) => res.end('Couldn\'t find passed URL from database.'));
});

// shorten url
app.get('/shorten/*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const originalUrl = parsedUrl.pathname.substring(9);

    var output;
    // check if passed url is valid (http or https)
    if(validUrl.isWebUri(originalUrl)) {
        const shortUrlId = generateShortUrl();
        const shortUrl = 'https://secret-meadow-30442.herokuapp.com/' + shortUrlId;
        output = {original_url: originalUrl, short_url: shortUrl};

        insertUrl(shortUrlId, shortUrl, originalUrl);
    } else {
        output = {error: 'Invalid URL address'};
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(output));
});

app.listen(app.get('port'));

function generateShortUrl() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var shortUrl = '';

    for(var i = 0; i < 4; i++ ) {
        shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return shortUrl;
}
