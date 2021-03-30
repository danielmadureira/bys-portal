import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import {
  user,
  feedPost,
  forumGroup,
  forumRoom,
  forumComment
} from './modules';

Vue.use(Vuex);

const baseStore = {
  namespaced: true,
  state: {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    isLoaded: false,
    loadingProgress: 0
  },
  mutations: {
    toggleSidebarDesktop (state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow);
      state.sidebarShow = sidebarOpened ? false : 'responsive';
    },
    toggleSidebarMobile (state) {
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow);
      state.sidebarShow = sidebarClosed ? true : 'responsive';
    },
    set (state, [variable, value]) {
      state[variable] = value;
    },
    setIsLoaded(state, payload) {
      state.isLoaded = payload;
    },
    setLoadingProgress(state, payload) {
      state.loadingProgress = payload;
    }
  },
  actions: {
    async loadBaseData({ dispatch, commit }) {
      await dispatch('user/loadInfo');

      commit('setLoadingProgress', 100);
      commit('setIsLoaded', true);
    }
  },
  modules: {
    user,
    feedPost,
    forumGroup,
    forumRoom,
    forumComment
  }
};

export default new Vuex.Store(baseStore);
