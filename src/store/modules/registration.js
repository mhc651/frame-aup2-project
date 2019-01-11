/**
 * Created by TIMMY on 2018/4/25.
 */
import {detail, groupDetail, getOrigin, saveRegistraction, submitRegisterCheck, cancleRegisterCheck, registerInto, findRegistersForPage, delteRegisters} from '@/services/registration';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    detail({commit}, params) {
      return detail(params);
    },
    group({commit}, params) {
      return groupDetail(params);
    },
    getOrigin({commit}, params) {
      return getOrigin(params);
    },
    saveRegistraction({commit}, params) {
      return saveRegistraction(params);
    },
    submitRegisterCheck({commit}, params) {
      return submitRegisterCheck(params);
    },
    cancleRegisterCheck({commit}, params) {
      return cancleRegisterCheck(params);
    },
    registerInto({commit}, params) {
      return registerInto(params);
    },
    findRegistersForPage({commit}, params) {
      return findRegistersForPage(params);
    },
    delteRegisters({commit}, params) {
      return delteRegisters(params);
    }
  }
};
