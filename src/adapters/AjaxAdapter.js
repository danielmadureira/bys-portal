import axios from 'axios';

import { AuthToken } from './AuthToken';

import { HTTP_METHODS } from '@/enums';
import { HTTPError } from '@/errors/HTTPError'

/**
 * Class AjaxAdapter
 */
class AjaxAdapter {
  /**
   * AjaxAdapter constructor
   */
  constructor() {
    AjaxAdapter.axiosInstance = undefined;
  }

  /**
   * Makes a new Ajax request.
   *
   * @param {String|URL} url
   * @param {String} method
   * @param {Object} body
   * @param {Object} headers
   * @param {Boolean} auth
   * @return {Promise<Object>}
   */
  async request({
    url= '',
    method = HTTP_METHODS.GET,
    body= { },
    headers= { },
    auth = true
  }) {
    if (auth) {
      headers['Authorization'] = `Bearer ${AuthToken.token}`;
    }

    let response;
    try {
      response = await this._axios.request({
        url,
        method,
        headers,
        data: body,
        withCredentials: auth
      });
    } catch (error) {
      throw new HTTPError(
        error.response.status,
        error.response.data.message,
        error.response.data
      );
    }

    return response.data;
  }

  /**
   * Returns an Axios instance
   * singleton.
   *
   * @return {*}
   */
  get _axios() {
    if (!AjaxAdapter.axiosInstance) {
      this._initializeAxios();
    }

    return AjaxAdapter.axiosInstance;
  }

  /**
   * Initializes Axios' instance
   * singleton.
   *
   * @private
   */
  _initializeAxios() {
    AjaxAdapter.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
  }
}

export { AjaxAdapter };
