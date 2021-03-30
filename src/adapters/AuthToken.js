/**
 * Class AuthToken
 */
class AuthToken {
  /**
   * Returns the personal
   * authentication token.
   *
   * @return {string}
   */
  static get token() {
    return window.localStorage.getItem(AuthToken.KEY_NAME);
  }

  /**
   * Sets the personal
   * authentication token.
   *
   * @param authToken
   */
  static set token(authToken) {
    window.localStorage.setItem(AuthToken.KEY_NAME, authToken);
  }

  /**
   * Deletes the personal
   * authentication token.
   */
  static delete() {
    window.localStorage.removeItem(AuthToken.KEY_NAME);
  }
}

// Static constants.
AuthToken.KEY_NAME = 'personal_token';

export { AuthToken };
