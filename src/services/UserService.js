import { sha256 } from 'js-sha256';

import { ENDPOINTS, HTTP_METHODS, HTTP_STATUS_CODE } from '@/enums';
import {DisplayableError, HTTPError} from "@/errors";
import { AjaxAdapter, AuthToken } from '@/adapters';

/**
 * Class UserService
 */
class UserService {
    /**
     * UserService constructor
     */
    constructor() {
        this.ajax = new AjaxAdapter();
    }

    /**
     * Logs user in.
     *
     * @param {String} email
     * @param {String} password
     * @return {Promise<Object>}
     */
    async login(email, password) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', sha256(password));
        formData.append('device_name', navigator.userAgent);

        try {
            const { token } = await this.ajax.request({
                url: ENDPOINTS.LOGIN,
                method: HTTP_METHODS.POST,
                body: formData,
                auth: false
            });

            AuthToken.token = token;
        } catch (error) {
            let errorMessage = 'Houve um erro ao tentar realizar login.';
            if (error?.code === HTTP_STATUS_CODE.UNAUTHORIZED) {
                errorMessage = error.message;
            }

            throw new DisplayableError(errorMessage);
        }
    }

    /**
     * Logs user out.
     *
     * @return {Promise<void>}
     */
    async logout() {
        await this.ajax.request({
            url: ENDPOINTS.LOGOUT,
            method: HTTP_METHODS.POST
        });

        AuthToken.delete();
    }

    /**
     * Returns user's information.
     *
     * @param userId
     * @return {Promise<*>}
     */
    async getUserInfo(userId = null) {
        return await this.ajax.request({
            url: ENDPOINTS.USER(userId)
        });
    }

    /**
     * Toggles user's administrator
     * privileges.
     *
     * @param {Number} userId
     * @return {Promise<void>}
     */
    async togglePrivileges(userId) {
        const url = new URL(ENDPOINTS.USER().PRIVILEGES(userId));

        try {
            await this.ajax.request({
                url,
                method: HTTP_METHODS.PUT
            });

        } catch (error) {
            const errorMessage = 'Houve um erro ao tentar alterar os privilégios'
                + ' de administrador deste usuário';

            throw new DisplayableError(errorMessage);
        }
    }

    /**
     * Fetches all users.
     *
     * @param {Number} page
     * @param {Number} perPage
     * @return {Promise<{userPage, numberOfPages}>}
     */
    async getUsers(page = 1, perPage = 15) {
        const url = new URL(ENDPOINTS.USER().ALL);
        url.searchParams.append('page', page);
        url.searchParams.append('per_page', perPage);

        try {
            const { data, last_page } = await this.ajax.request({
                url
            });

            return {
                userPage: data.map(this._fixUserDates),
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
     * Deletes a user.
     *
     * @param {Number} userId
     * @return {Promise<void>}
     */
    async deleteUser(userId) {
        const url = new URL(ENDPOINTS.USER(userId));

        try {
            await this.ajax.request({
                url,
                method: HTTP_METHODS.DELETE
            });

        } catch (error) {
            throw new DisplayableError(
              'Houve um erro a tentar remover este usuário'
            );
        }
    }

    /**
     * Parses object dates.
     *
     * @param {Object} user
     * @return {Object}
     * @private
     */
    _fixUserDates(user) {
        user.created_at = user.created_at ? new Date(user.created_at) : null;
        user.updated_at = user.updated_at ? new Date(user.updated_at) : null;
        user.deleted_at = user.deleted_at ? new Date(user.deleted_at) : null;

        return user;
    }
}

export { UserService };
