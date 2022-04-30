/**
 * Sbstract Base class for the errors that may happen during the authorization process.
 */
class OAuth2Exception extends Error {
  /**
   * OAuth 2.0 Error Code.
   */
  errorCode;

  /**
   * HTTP Response Status Code of the OAuth 2.0 Exception.
   */
  statusCode = 400;

  /**
   * HTTP Response Headers of the OAuth 2.0 Exception.
   */
  headers = {};

  /**
   * Parameters of the OAuth 2.0 Exception.
   */
  data;

  /**
   * Instantiates a new OAuth 2.0 Exception.
   *
   * @param {Record<string, any>} params Parameters of the OAuth 2.0 Exception.
   */
  constructor(params = {}) {
    super(params.error_description);

    this.data = params;
  }

  /**
   * Sets a HTTP Response Header of the OAuth 2.0 Exception.
   *
   * @param header Name of the HTTP Response Header.
   * @param value Value of the HTTP Response Header.
   */
  setHeader(header, value) {
    this.headers[header] = value;
    return this;
  }

  /**
   * Sets multiple HTTP Response Headers of the OAuth 2.0 Exception.
   *
   * @param headers HTTP Response Headers.
   */
  setHeaders(headers) {
    Object.assign(this.headers, headers);
    return this;
  }

  /**
   * Parameters of the OAuth 2.0 Exception.
   */
  toJSON() {
    return { error: this.errorCode, ...this.data };
  }
}

module.exports = { OAuth2Exception };
