import { ForumCommentService } from "@/services/ForumCommentService";

const forumComment = {
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
    setNewPage(state, { pageNumber, commentPage }) {
      state.paginatedRecords = {
        ...state.paginatedRecords,
        [pageNumber]: commentPage
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
    async deleteComment({ state, commit, dispatch }, comment) {
      const forumCommentService = new ForumCommentService();
      await forumCommentService.deleteComment(comment.id);

      commit('deletePagesAfterCurrent');
      await dispatch('forumComment/downloadPage', state.currentPage, { root: true });
    },
    async downloadPage({ state, commit }, pageNumber) {
      state.downloadInProgress = true;
      const forumCommentService = new ForumCommentService();
      const {
        commentPage,
        numberOfPages
      } = await forumCommentService.getComments(pageNumber);

      commit('numberOfPages', numberOfPages);
      commit('setNewPage', { pageNumber, commentPage });
      state.downloadInProgress = false;
    },
    async assertPageExists({ state, dispatch }, pageNumber) {
      if (state.paginatedRecords[pageNumber] !== undefined) {
        return;
      }

      await dispatch('forumComment/downloadPage', pageNumber, { root: true });
    }
  }
};

export default forumComment;
