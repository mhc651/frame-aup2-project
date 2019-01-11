/**
 * Created by TIMMY on 2018/4/25.
 */
import {into, find, remove, categories, save, detail, downTemplate, uploadExcel, uploadZIP, cancleCheck, addDetail, saveOrUpdateAddDetail} from '@/services/apply';
export default {
  namespaced: true,
  state: {
    into: null
  },
  mutations: {
    SET_INTO: (state, into) => {
      state.into = into;
    }
  },
  actions: {
    /**
     * 用户获取产品分类
     */
    into({commit}, params) {
      return new Promise((resolve, reject) => {
        into(params).then(payload => {
          if (payload) {
            commit('SET_INTO', !!(payload.success && payload.content));
          }
          return resolve(payload);
        });
      });
    },
    find({commit}, params) {
      return find(params);
    },
    remove({commit}, params) {
      return remove(params);
    },
    // 产品分类
    categories({commit}, params) {
      return categories(params);
    },
    save({commit}, params) {
      //console.log(params);
      var mhc = JSON.stringify(params);
      //console.log(mhc);
      return save(params);
    },
    detail({commit}, params) {
      return detail(params);
    },
    downTemplate({commit}, params) {
      return downTemplate(params);
    },
    uploadExcel({commit}, params) {
      return uploadExcel(params);
    },
    uploadZIP({commit}, params) {
      return uploadZIP(params);
    },
    cancleCheck({commit}, params) {
      return cancleCheck(params);
    },
    addDetail({commit}, params) {
      return addDetail(params);
    },
    saveOrUpdateAddDetail({commit}, params) {
      return saveOrUpdateAddDetail(params);
    }
  }
};
