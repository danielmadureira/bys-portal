import { AjaxAdapter } from "@/adapters";
import { ENDPOINTS, HTTP_METHODS } from '@/enums';
import { DisplayableError, HTTPError } from "@/errors";

/**
 * Class ForumRoomService
 */
class ForumRoomService {
  /**
   * ForumRoomService constructor
   */
  constructor() {
    this.ajax = new AjaxAdapter();
  }

  /**
   * Creates a new room.
   *
   * @param {String} name
   * @param {String} description
   * @param {Number} groupId
   * @return {Promise<void>}
   */
  async createRoom({ name, description, groupId }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('forum_group_id', groupId);

    try {
      await this.ajax.request({
        url: ENDPOINTS.FORUM.ROOM(),
        method: HTTP_METHODS.POST,
        body: formData
      });

    } catch (error) {
      let data = [ 'Houve um erro ao tentar salvar o post' ];
      if (Object.keys(error.data.errors).length) {
        data = Object.values(error.data.errors)
          .reduce((acc, error) => [ ...acc, ...error ]);
      }

      throw new DisplayableError(data[0], data);
    }
  }

  /**
   * Fetched all rooms.
   *
   * @param {Number} page
   * @param {Number} perPage
   * @return {Promise<{roomPage, numberOfPages}>}
   */
  async getRooms(page = 1, perPage = 15) {
    const url = new URL(ENDPOINTS.FORUM.ROOM());
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', perPage);

    try {
      const { data, last_page } = await this.ajax.request({
        url
      });

      return {
        roomPage: data.map(this._fixRoomDates),
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
   * Deletes a room.
   *
   * @param {Number} roomId
   * @return {Promise<void>}
   */
  async deleteRoom(roomId) {
    const url = new URL(ENDPOINTS.FORUM.ROOM(roomId));

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
   * @param {Object} room
   * @return {Object}
   * @private
   */
  _fixRoomDates(room) {
    room.created_at = room.created_at ? new Date(room.created_at) : null;
    room.updated_at = room.updated_at ? new Date(room.updated_at) : null;
    room.deleted_at = room.deleted_at ? new Date(room.deleted_at) : null;

    return room;
  }

}

export { ForumRoomService };
