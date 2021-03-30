/**
 * Class HTTPError
 */
class HTTPError extends Error {
  /**
   * HTTPError constructor
   *
   * @param {Number} httpCode
   * @param {String} message
   * @param {*} data
   */
  constructor(httpCode, message, data = null) {
    super(message);
    this.httpCode = httpCode;
    this.data = data;
  }

  /**
   * The HTTP error code.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   *
   * @return {Number}
   */
  get code() {
    return this.httpCode;
  }
}

export { HTTPError };
