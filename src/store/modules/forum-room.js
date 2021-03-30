import { ForumRoomService } from "@/services/ForumRoomService";

const forumRoom = {
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
    setNewPage(state, { pageNumber, roomPage }) {
      state.paginatedRecords = {
        ...state.paginatedRecords,
        [pageNumber]: roomPage
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
    async createRoom({ state, commit, dispatch }, roomData) {
      const forumRoomService = new ForumRoomService();
      await forumRoomService.createRoom(roomData);

      commit('setCurrentPage', 1);
      commit('deletePagesAfterCurrent');
      await dispatch('forumRoom/downloadPage', state.currentPage, { root: true });
    },
    async deleteRoom({ state, commit, dispatch }, room) {
      const forumRoomService = new ForumRoomService();
      await forumRoomService.deleteRoom(room.id);

      commit('deletePagesAfterCurrent');
      await dispatch('forumRoom/downloadPage', state.currentPage, { root: true });
    },
    async downloadPage({ state, commit }, pageNumber) {
      state.downloadInProgress = true;
      const forumRoomService = new ForumRoomService();
      const { roomPage, numberOfPages } = await forumRoomService.getRooms(pageNumber);

      commit('numberOfPages', numberOfPages);
      commit('setNewPage', { pageNumber, roomPage });
      state.downloadInProgress = false;
    },
    async assertPageExists({ state, dispatch }, pageNumber) {
      if (state.paginatedRecords[pageNumber] !== undefined) {
        return;
      }

      await dispatch('forumRoom/downloadPage', pageNumber, { root: true });
    }
  }
};

export default forumRoom;
