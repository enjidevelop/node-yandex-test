const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;

    if (path === '/') {
        return fs.createReadStream('./index.html')
            .pipe(res);
    }

    if (fs.existsSync(`.${path}`)) {
        fs.createReadStream(`.${path}`)
            .pipe(res);
    } else {
        res.statusCode = 404;
        res.end();
    }
})

server.listen(8888)
