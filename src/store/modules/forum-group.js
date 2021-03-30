import { ForumGroupService } from "@/services/ForumGroupService";

const forumGroup = {
  namespaced: true,
  state: {
    paginatedRecords: { },
    currentPage: 1,
    numberOfPages: 1,
    downloadInProgress: false
  },
  mutations: {
    setCurrentPage(state, pageNumber) {
      state.currentPage = pageNumber;
    },
    setNewPage(state, { pageNumber, groupPage }) {
      state.paginatedRecords = {
        ...state.paginatedRecords,
        [pageNumber]: groupPage
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
    async createGroup({ state, commit, dispatch }, groupData) {
      const forumGroupService = new ForumGroupService();
      await forumGroupService.createGroup(groupData);

      commit('setCurrentPage', 1);
      commit('deletePagesAfterCurrent');
      await dispatch('forumGroup/downloadPage', state.currentPage, { root: true });
    },
    async deleteGroup({ state, commit, dispatch }, group) {
      const forumGroupService = new ForumGroupService();
      await forumGroupService.deleteGroup(group.id);

      commit('deletePagesAfterCurrent');
      await dispatch('forumGroup/downloadPage', state.currentPage, { root: true });
    },
    async downloadPage({ state, commit }, pageNumber) {
      state.downloadInProgress = true;
      const forumGroupService = new ForumGroupService();
      const { groupPage, numberOfPages } = await forumGroupService.getGroups(pageNumber);

      commit('numberOfPages', numberOfPages);
      commit('setNewPage', { pageNumber, groupPage });
      state.downloadInProgress = false;
    },
    async assertPageExists({ state, dispatch }, pageNumber) {
      if (state.paginatedRecords[pageNumber] !== undefined) {
        return;
      }

      await dispatch('forumGroup/downloadPage', pageNumber, { root: true });
    }
  }
};

export default forumGroup;
