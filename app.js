const http = require('http');
const crypto = require('crypto');

function respondWithNotFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Not found.");
}

function respondWithBadRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Bad request.");
}

function respondWithInternalServerError(res) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Internal server error.");
}

function respondWithSuccess(res, content) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
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
