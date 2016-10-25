const http = require('http');
const crypto = require('crypto');

function respondWithNotFound(res) {
  res.statusCode = 404;
  res.end();
}

function respondWithRandomData(res, countOfRandomBytes) {
  res.setHeader('Content-Type', 'text/plain');

  crypto.randomBytes(countOfRandomBytes, (err, buf) => {
    if (err) {
      res.statusCode = 500;
      res.end();
    } else {
      res.statusCode = 200;
      res.end(`${buf.toString('hex')}\n`);
    }
  });
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log("Handling request for: " + req.url);

  if (req.url !== "/favicon.ico") {
    const requestedBytesParameter = parseInt(req.url.substr(1));

    if (requestedBytesParameter !== NaN) {
      respondWithRandomData(res, requestedBytesParameter);
    }
  } else {
    respondWithNotFound(res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});