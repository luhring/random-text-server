const http = require('http');
const crypto = require('crypto');

// Configuration constants
const _port = 3000;
const _contentType = "text/plain";
const _charset = "utf-8";
const _encodingFormatForRandomBytes = "base64";

function setHeadersOnResponseAndSend(res, statusCode, contentType, charset, responseContent) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.setHeader('charset', charset);
  res.end(responseContent);
}

function respondWithNotFound(res) {
  const responseContent = "Not found.";
  setHeadersOnResponseAndSend(res, 404, _contentType, _charset, responseContent);
}

function respondWithBadRequest(res) {
  const responseContent = "Bad request.";
  setHeadersOnResponseAndSend(res, 400, _contentType, _charset, responseContent);
}

function respondWithInternalServerError(res) {
  const responseContent = "Internal server error.";
  setHeadersOnResponseAndSend(res, 500, _contentType, _charset, responseContent);
}

function respondWithSuccess(res, content) {
  setHeadersOnResponseAndSend(res, 200, _contentType, _charset, content);
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
        respondWithSuccess(res, `${buf.toString(_encodingFormatForRandomBytes)}\n`);
      }
    });
  }
}

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

server.listen(_port, () => {
  console.log(`Server running on port ${_port}`);
});
