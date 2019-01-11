import * as types from './mutations-types';
const mutations = {
  [types.GET_PAGE_MODEL](state, payload) {
    state.pageModel = payload.content;
  },
  [types.LOGOUT](state, payload) {
    sessionStorage.removeItem('_token');
    localStorage.removeItem('vuex');
    window.location.href = '/portal/login';
  },
  [types.GET_TOKEN](state, payload) {
    state.token = payload;
  },
  [types.GET_INIT_INTODATA](state, payload) {
    state.initIntoData = payload.content;
  },
  /**
   * 当前报价配置
   * @param {*} state 
   * @param {*} payload 
   */
  ['offterConfig'](state, payload) {
    state.offterConfig = payload.content;
  },
};
export default mutations;
