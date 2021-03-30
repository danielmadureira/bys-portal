import { AjaxAdapter } from "@/adapters";
import { ENDPOINTS, HTTP_METHODS } from '@/enums';
import { DisplayableError, HTTPError } from "@/errors";

/**
 * Class ForumCommentService
 */
class ForumCommentService {
  /**
   * ForumCommentService constructor
   */
  constructor() {
    this.ajax = new AjaxAdapter();
  }

  /**
   * Fetches all comments.
   *
   * @param {Number} page
   * @param {Number} perPage
   * @return {Promise<{commentPage, numberOfPages}>}
   */
  async getComments(page = 1, perPage = 15) {
    const url = new URL(ENDPOINTS.FORUM.COMMENT());
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', perPage);

    try {
      const { data, last_page } = await this.ajax.request({
        url
      });

      return {
        commentPage: data.map(this._fixCommentDates),
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
   * Deletes a comment.
   *
   * @param {Number} commentId
   * @return {Promise<void>}
   */
  async deleteComment(commentId) {
    const url = new URL(ENDPOINTS.FORUM.COMMENT(commentId));

    try {
      await this.ajax.request({
        url,
        method: HTTP_METHODS.DELETE
      });

    } catch (error) {
      throw new DisplayableError(
        'Houve um erro a tentar remover esta sala'
      );
    }
  }

  /**
   * Parses object dates.
   *
   * @param {Object} comment
   * @return {Object}
   * @private
   */
  _fixCommentDates(comment) {
    comment.created_at = comment.created_at ? new Date(comment.created_at) : null;
    comment.updated_at = comment.updated_at ? new Date(comment.updated_at) : null;
    comment.deleted_at = comment.deleted_at ? new Date(comment.deleted_at) : null;

    return comment;
  }

}

export { ForumCommentService };
