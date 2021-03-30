import { AjaxAdapter } from "@/adapters";
import { ENDPOINTS, HTTP_METHODS } from '@/enums';
import { DisplayableError, HTTPError } from "@/errors";

/**
 * Class ForumGroupService
 */
class ForumGroupService {
  /**
   * ForumGroupService constructor
   */
  constructor() {
    this.ajax = new AjaxAdapter();
  }

  /**
   * Creates a new group.
   *
   * @param {String} name
   * @param {String} description
   * @return {Promise<void>}
   */
  async createGroup({ name, description }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    try {
      await this.ajax.request({
        url: ENDPOINTS.FORUM.GROUP(),
        method: HTTP_METHODS.POST,
        body: formData
      });

    } catch (error) {
      let data = null;
      let message = 'Houve um erro ao tentar salvar o grupo';
      if (error.data.errors) {
        data = Object.values(error.data.errors)
          .reduce((acc, error) => [ ...acc, ...error ]);
        message = data[0];
      }

      throw new DisplayableError(message, data);
    }
  }

  /**
   * Fetches all groups.
   *
   * @param {Number} page
   * @param {Number} perPage
   * @return {Promise<{numberOfPages, groupPage}>}
   */
  async getGroups(page = 1, perPage = 15) {
    const url = new URL(ENDPOINTS.FORUM.GROUP());
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', perPage);

    try {
      const { data, last_page } = await this.ajax.request({
        url
      });

      return {
        groupPage: data.map(this._fixGroupDates),
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
   * Deletes a group.
   *
   * @param {Number} groupId
   * @return {Promise<void>}
   */
  async deleteGroup(groupId) {
    const url = new URL(ENDPOINTS.FORUM.GROUP(groupId));

    try {
      await this.ajax.request({
        url,
        method: HTTP_METHODS.DELETE
      });

    } catch (error) {
      throw new DisplayableError(
        'Houve um erro a tentar remover este grupo'
      );
    }
  }

  /**
   * Parses object dates.
   *
   * @param {Object} group
   * @return {Object}
   * @private
   */
  _fixGroupDates(group) {
    group.created_at = group.created_at ? new Date(group.created_at) : null;
    group.updated_at = group.updated_at ? new Date(group.updated_at) : null;
    group.deleted_at = group.deleted_at ? new Date(group.deleted_at) : null;

    return group;
  }

}

export { ForumGroupService };
