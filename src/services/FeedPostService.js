import { AjaxAdapter } from '@/adapters';
import { ENDPOINTS, HTTP_METHODS } from '@/enums';
import { DisplayableError, HTTPError } from "@/errors";

/**
 * Class FeedPostService
 */
class FeedPostService {
  /**
   * FeedPostService constructor
   */
  constructor() {
    this.ajax = new AjaxAdapter();
  }

  /**
   * Creates a new post.
   *
   * @param {String} title
   * @param {String} text
   * @param {String} headline
   * @param {File} picture
   * @param {String} picture_description
   * @return {Promise<void>}
   */
  async createPost({
    title,
    text,
    headline = null,
    picture = null,
    picture_description = null
  }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('headline', headline);
    formData.append('picture', picture || '');
    formData.append('picture_description', picture_description);

    try {
      await this.ajax.request({
        url: ENDPOINTS.FEED.POST(),
        method: HTTP_METHODS.POST,
        body: formData
      });

    } catch (error) {
      let data = null;
      let message = 'Houve um erro ao tentar salvar o post';
      if (error.data.errors) {
        data = Object.values(error.data.errors)
          .reduce((acc, error) => [ ...acc, ...error ]);
        message = data[0];
      }

      throw new DisplayableError(message, data);
    }
  }

  /**
   * Fetches all posts.
   *
   * @param {Number} page
   * @param {Number} perPage
   * @return {Promise<{postPage, numberOfPages}>}
   */
  async getPosts(page = 1, perPage = 15) {
    const url = new URL(ENDPOINTS.FEED.POST());
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', perPage);

    try {
      const { data, last_page } = await this.ajax.request({
        url
      });

      return {
        postPage: data.map(this._fixPostDates),
        numberOfPages: last_page
      };

    } catch (error) {
      throw new HTTPError(
        error.code,
        error.response.data.message
      );
    }
  }

  /**
   * Deletes a post.
   *
   * @param {Number} postId
   * @return {Promise<void>}
   */
  async deletePost(postId) {
    const url = new URL(ENDPOINTS.FEED.POST(postId));

    try {
      await this.ajax.request({
        url,
        method: HTTP_METHODS.DELETE
      });

    } catch (error) {
      throw new DisplayableError(
        'Houve um erro a tentar remover este post'
      );
    }
  }

  /**
   * Parses object dates.
   *
   * @param {Object} post
   * @return {Object}
   * @private
   */
  _fixPostDates(post) {
    post.created_at = post.created_at ? new Date(post.created_at) : null;
    post.updated_at = post.updated_at ? new Date(post.updated_at) : null;
    post.deleted_at = post.deleted_at ? new Date(post.deleted_at) : null;

    return post;
  }
}

export { FeedPostService };
