const http = require('http');
const crypto = require('crypto');

function respondWithNotFound(res) {
  res.statusCode = 404;
  res.end();
}

function respondWithBadRequest(res) {
  res.statusCode = 400;
  res.end();
}

function respondWithInternalServerError(res) {
  res.statusCode = 500;
  res.end();
}

function respondWithSuccess(res, content) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  res.end(content);
}

function respondToRequest(res, requestedBytesParameter) {
  const countOfRequestedBytes = parseInt(requestedBytesParameter);

  if (isNaN(countOfRequestedBytes) || countOfRequestedBytes < 0) {
    respondWithBadRequest(res);
  } else {
    crypto.randomBytes(countOfRequestedBytes, (err, buf) => {
      if (err) {
        respondWithInternalServerError(res);
      } else {
        respondWithSuccess(res, `${buf.toString('hex')}\n`);
      }
    });
  }
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const requestedPath = req.url;

  console.log("Handling request for: " + requestedPath);

  if (req.url !== "/favicon.ico") {
    const requestedBytesParameter = requestedPath.substr(1);

    respondToRequest(res, requestedBytesParameter);
  } else {
    respondWithNotFound(res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});