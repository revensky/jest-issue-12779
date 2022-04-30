const { OAuth2Exception } = require("./oauth2.exception");

class InvalidGrantException extends OAuth2Exception {
  errorCode = 'invalid_grant';
}

module.exports = { InvalidGrantException };
