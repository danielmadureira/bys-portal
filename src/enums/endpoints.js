const _baseUrl = process.env?.VUE_APP_API_URL ?? '';

const ENDPOINTS = Object.freeze({
    LOGIN: `${_baseUrl}/login`,
    LOGOUT: `${_baseUrl}/logout`,
    USER(userId = null) {
        let url = `${_baseUrl}/user`;
        if (userId) {
            return `${url}/${userId}`;
        }

        return {
            toString() {
                return url;
            },
            PRIVILEGES(userId) {
                return `${url}/privileges/${userId}`;
            },
            ALL: `${url}/all` // Returns all users (admin only).
        };
    },
    FEED: {
        POST(postId = null) {
            let url = `${_baseUrl}/feed/post`
            if (postId) {
                url = `${url}/${postId}`;
            }
            return url;
        }
    },
    FORUM: {
        GROUP(groupId = null) {
            let url = `${_baseUrl}/forum/group`
            if (groupId) {
                url = `${url}/${groupId}`;
            }
            return url;
        },
        ROOM(roomId = null) {
            let url = `${_baseUrl}/forum/room`
            if (roomId) {
                url = `${url}/${roomId}`;
            }
            return url;
        },
        COMMENT(commentId = null) {
            let url = `${_baseUrl}/forum/comment`
            if (commentId) {
                url = `${url}/${commentId}`;
            }
            return url;
        }
    }
});

export { ENDPOINTS };
