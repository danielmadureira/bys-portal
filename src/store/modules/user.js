import { UserService } from '@/services/UserService';

const user = {
    namespaced: true,
    state: {
        paginatedRecords: { },
        currentPage: 1,
        numberOfPages: 1,
        downloadInProgress: false,
        // user
        id: '',
        name: '',
        profession: '',
        profile_picture: '',
        email: '',
        user_type: '',
        created_at: '',
        updated_at: '',
        deleted_at: ''
    },
    mutations: {
        updateUser(state, payload) {
            state.id = payload?.id || state.id;
            state.name = payload?.name || state.name;
            state.profession = payload?.profession || state.profession;
            state.profile_picture = payload?.profile_picture || state.profile_picture;
            state.email = payload?.email || state.email;
            state.user_type = payload?.user_type || state.user_type;
            state.created_at = payload?.created_at || state.created_at;
            state.updated_at = payload?.updated_at || state.updated_at;
            state.deleted_at = payload?.deleted_at || state.deleted_at;
        },
        clearOutUser(state) {
            state.id = '';
            state.name = '';
            state.profession = '';
            state.profile_picture = '';
            state.email = '';
            state.user_type = '';
            state.created_at = '';
            state.updated_at = '';
            state.deleted_at = '';
        },
        setCurrentPage(state, pageNumber) {
            state.currentPage = pageNumber;
        },
        setNewPage(state, { pageNumber, userPage }) {
            state.paginatedRecords = {
                ...state.paginatedRecords,
                [pageNumber]: userPage
            }
        },
        deletePagesAfterCurrent(state) {
            Object.keys(state.paginatedRecords)
              .forEach(pageNumber => {
                  if (pageNumber > state.currentPage) {
                      delete state.paginatedRecords[pageNumber];
                  }
              });
        },
        numberOfPages(state, numberOfPages) {
            state.numberOfPages = numberOfPages;
        }
    },
    actions: {
        async login(context, { email, password }) {
            const userService = new UserService();
            await userService.login(email, password);
        },
        async logout({ commit }) {
            const userService = new UserService();
            await userService.logout();
            commit('clearOutUser');
        },
        async loadInfo({ commit }) {
            const userService = new UserService();
            const userInfo = await userService.getUserInfo();

            commit('updateUser', userInfo);
        },
        async togglePrivileges({ state, dispatch }, user) {
            const userService = new UserService();
            await userService.togglePrivileges(user.id);

            await dispatch('user/downloadPage', state.currentPage, { root: true });
        },
        async deleteUser({ state, commit, dispatch }, user) {
            const userService = new UserService();
            await userService.deleteUser(user.id);

            commit('deletePagesAfterCurrent');
            await dispatch('user/downloadPage', state.currentPage, { root: true });
        },
        async downloadPage({ state, commit }, pageNumber) {
            state.downloadInProgress = true;
            const userService = new UserService();
            const { userPage, numberOfPages } = await userService.getUsers(pageNumber);

            commit('numberOfPages', numberOfPages);
            commit('setNewPage', { pageNumber, userPage });
            state.downloadInProgress = false;
        },
        async assertPageExists({ state, dispatch }, pageNumber) {
            if (state.paginatedRecords[pageNumber] !== undefined) {
                return;
            }

            await dispatch('user/downloadPage', pageNumber, { root: true });
        }
    }
};

export default user;
