const { OAuth2Exception } = require("./oauth2.exception");

class InvalidRequestException extends OAuth2Exception {
  errorCode = 'invalid_request';
}

module.exports = { InvalidRequestException };
