import callApi from '../utils/callApi'
import * as types from './mutations-types'
import api from '../services/api'
import * as services from '../services/common'
const actions = {
  // 获取注册证列表
  registered({ commit }, payload) {
    return callApi(api.REGISTRATION_REGISTERLIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 获取产地
  productAddr({ commit }, payload) {
    return callApi(api.REGISTRATION_PRODUCTADDR, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  //管理类别
  manageType({ commit }, payload) {
    return callApi(api.REGISTRATION_MANATYPE, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  getPageModel({ commit }, payload) {
    return callApi(api.FRAME_QUERY, 'POST', {}).then(res => {
      if (res && res.success) {
        commit({
          type: types.GET_PAGE_MODEL,
          content: res.content
        })
      }
    })
  },
  getInitIntoData({ commit }, payload) {
    return callApi(api.PROJECT_APPLY_INTO, 'POST', {}).then(res => {
      if (res && res.success) {
        commit({
          type: types.GET_INIT_INTODATA,
          content: res.content
        })
      }
    })
  },
  logout({ commit }, payload) {
    return callApi(api.LOGOUT, 'POST').then(res => {
      if (res && res.success) {
        commit({
          type: types.LOGOUT,
          content: res.content
        })
      }
    })
  },
  sendCode({ commit }, payload) {
    return services.sendCode(payload)
  },
  uploadImage({ commit }, payload) {
    return services.uploadImage(payload)
  },
  setToken({ commit }, payload) {
    return callApi(api.TOKENAPIDATA, 'POST', { apiData: 1 }).then(res => {
      commit({
        type: types.GET_TOKEN,
        content: res.content
      })
      return Promise.resolve(res)
    })
  },
  // 企业申报提交
  submitOrgInfoApply({}, payload) {
    return callApi(api.SUB_ORG, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 撤回企业申报提交
  cancleSubmitOrgInfoApply({}, payload) {
    return callApi(api.PROJECT_APPLY_CANCLECHECK, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 产品申报提交
  submitProductApply({}, payload) {
    return callApi(api.SUB_PRO, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 产品规格
  proDetail({}, payload) {
    return callApi(api.PRO_DETAIL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 产品公示
   */
  showPro({}, payload) {
    return callApi(api.SHOW_PRO, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 公示详情
   */
  pubData({}, payload) {
    let pubs = [api.SHOW_REG, api.SHOW_GROUP, api.SHOW_PRO]
    let url = pubs[payload[0]]
    if (!url) return Promise.reject('没有找到对应的地址')
    let params = { id: payload[1] }
    if (!payload[0]) params = { registerId: payload[1] }
    return callApi(url, 'POST', params).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 产品规格 init
  proDetailInit({}, payload) {
    return callApi(api.PRO_DETAIL_INIT, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价提交
   * @param {*} param0
   * @param {*} payload
   */
  proOffter({}, payload) {
    return callApi(api.SUB_OFFER, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价轮次
   * @param {*} param0
   * @param {*} payload
   */
  offterAll({}, payload) {
    return callApi(api.OFFTER_ALL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价入选
   * @param {*} param0
   * @param {Object} payload
   * @param {Number} payload.index 0 本企业 1 全部
   */
  offterShowList({}, payload) {
    let apis = ['OFFTER_SHOW_self', 'OFFTER_SHOW']
    let key = apis[payload.active]
    return callApi(api[key], 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价密码是否存在
   * @param {*} param0
   * @param {*} payload
   */
  isOffterPw({}, payload) {
    return callApi(api.OFFTER_PW_BOOL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价密码设置
   */
  offterPw({}, payload) {
    return callApi(api.OFFTER_PW_SET, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价提交
   * @param {*} param0
   * @param {*} payload
   */
  offterList({}, payload) {
    return callApi(api.OFFTER_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价提交
   * @param {*} param0
   * @param {*} payload
   */
  commitOffter({}, payload) {
    return callApi(api.SUB_OFFTER, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价撤回
   */
  revokeOffter({}, payload) {
    return callApi(api.RECOKE_OFFTER, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 报价解密
   */
  decryptOffter({}, payload) {
    return callApi(api.OPEN_OFFTER, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 注册列表
   */
  regList({}, payload) {
    return callApi(api.REGISTRATION_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 组件列表
  groupList({}, payload) {
    return callApi(api.GROUP_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 组件详情
  groupDetail({}, payload) {
    return callApi(api.GROUP_DETAIL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 产品列表
  proList({}, payload) {
    return callApi(api.PRO_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 产品数据保存
  commitProDetail({}, payload) {
    return callApi(api.UPADATA_PRO_DETAIL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 保存组件
  commitGroupDetail({}, payload) {
    return callApi(api.UPADATA_GROUP_DETAIL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 提交产品审核
  subProId({}, payload) {
    return callApi(api.SUB_PRO, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 提交组件审核
  subGroupId({}, payload) {
    return callApi(api.SUB_GROUP, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 删除 组件
   */
  deleteGroupId({}, payload) {
    return callApi(api.DELETE_GROUP, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 删除 产品
   */
  deleteProId({}, payload) {
    return callApi(api.DELETE_PRO, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 撤回产品审核
  revokeProId({}, payload) {
    return callApi(api.RECOKE_PRO, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 撤回组件审核
  revokeGroupId({}, payload) {
    return callApi(api.RECOKE_GROUP, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 竞价分组
  typegroupAndAttibuteListByGrouptypeId({}, payload) {
    return callApi(api.TYPE_GROUP, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 注册证提交审核
  submitRegisterCheck({}, payload) {
    return callApi(api.REGISTRATION_CHECK, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 通过注册证Id获取选填字段信息
  getAttibuteConfigByRegisterId({}, payload) {
    return callApi(api.TYPE_REGISTER_ID, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 组件列表
  shortList({}, payload) {
    return callApi(api.SHORT_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 入围企业列表
  enterpriseEntryList({}, payload) {
    return callApi(api.ENTERPRISEENTRY_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  /**
   * 企业详情
   * @param {} param0
   * @param {*} payload
   */
  orgInfo({}, payload) {
    return callApi(api.PROJECT_ENTERPRISEENTRY_DETAIL, 'POST', payload).then(
      res => {
        if (res && res.success) {
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      }
    )
  },
  // 历史报价列表
  historyOfferList({}, payload) {
    return callApi(api.HISTORYOFFER_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 最终入选结果列表
  finalSelResList({}, payload) {
    return callApi(api.FINALSELRES_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 最终入选公示列表数据（全部可见）
  finalSelPubList({}, payload) {
    return callApi(api.FINALSELPUB_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  // 质量层次列表
  qualityList({}, payload) {
    return callApi(api.QUALITY_LIST, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },

  // 历史记录增补列表
  addProData({}, payload) {
    return callApi(api.PROJECT_APPLY_ADDPRODATA, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  addProDataDetail({}, payload) {
    return callApi(api.PROJECT_APPLY_ADDPRODATADETAIL, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },
  addProDataUpdate({}, payload) {
    return callApi(api.PROJECT_APPLY_ADDPRODATAD_UPDATE, 'POST', payload).then(res => {
      if (res && res.success) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  },

}

export default actions
