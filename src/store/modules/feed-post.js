import { FeedPostService } from "@/services/FeedPostService";

const feedPost = {
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
    setNewPage(state, { pageNumber, postPage }) {
      state.paginatedRecords = {
        ...state.paginatedRecords,
        [pageNumber]: postPage
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
    async createPost({ state, commit, dispatch }, postData) {
      const feedPostService = new FeedPostService();
      await feedPostService.createPost(postData);

      commit('setCurrentPage', 1);
      commit('deletePagesAfterCurrent');
      await dispatch('feedPost/downloadPage', state.currentPage, { root: true });
    },
    async deletePost({ state, commit, dispatch }, post) {
      const feedPostService = new FeedPostService();
      await feedPostService.deletePost(post.id);

      commit('deletePagesAfterCurrent');
      await dispatch('feedPost/downloadPage', state.currentPage, { root: true });
    },
    async downloadPage({ state, commit }, pageNumber) {
      state.downloadInProgress = true;
      const feedPostService = new FeedPostService();
      const { postPage, numberOfPages } = await feedPostService.getPosts(pageNumber);

      commit('numberOfPages', numberOfPages);
      commit('setNewPage', { pageNumber, postPage });
      state.downloadInProgress = false;
    },
    async assertPageExists({ state, dispatch }, pageNumber) {
      if (state.paginatedRecords[pageNumber] !== undefined) {
        return;
      }

      await dispatch('feedPost/downloadPage', pageNumber, { root: true });
    }
  }
};

export default feedPost;
