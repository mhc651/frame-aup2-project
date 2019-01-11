/**
 * Created by TIMMY on 2018/4/24.
 */
export default {
  // login/logout
  LOGOUT: '/portal/api/auth/logout', // 退出 s
  // frame
  FRAME_QUERY: '/aup2org/api/model/getframework', // 页面框架模型
  // 企业申报提交
  SUB_ORG: '/aup2org/api/project/apply/submitOrgInfoApply ',
  // 产品提交
  SUB_PRO: '/aup2org/api/project/apply/submitProductApply',
  // 产品
  PRO_DETAIL: '/aup2org/api/project/apply/productDetail_audit',
  // 产品规划
  PRO_DETAIL_INIT:
    '/aup2org/api/project/apply/getTypegroupAndAttibuteListByGrouptypeId',
  // 产品组件详情
  GROUP_DETAIL: '/aup2org/api/project/apply/groupDetail_audit',
  // 更新产品
  UPADATA_PRO_DETAIL: '/aup2org/api/project/apply/saveOrUpdate_single',
  // 组件列表
  GROUP_LIST: '/aup2org/api/project/apply/pageDataSubGroup',
  // 更新组件
  UPADATA_GROUP_DETAIL: '/aup2org/api/project/apply/group_saveOrUpdate',
  // 组件提交审核
  SUB_GROUP: '/aup2org/api/project/apply/submitSubGroupApply',
  // 组件撤回
  RECOKE_GROUP: '/aup2org/api/project/apply/revokeSubGroupApply',
  DELETE_GROUP: '/aup2org/api/project/apply/deleteSubGroupsByIds',
  // 报价轮次
  OFFTER_ALL: '/aup2org/api/product/offer/queryOfferConfigList',
  /**
   * 报价公示全部企业
   * */
  OFFTER_SHOW: '/aup2org/api/product/selected/queryPublicityAll',
  /**
   * 报价公示本企业
   * */
  OFFTER_SHOW_self: '/aup2org/api/product/selected/queryPublicityMy',
  // 是否设置管理密码
  OFFTER_PW_BOOL: '/aup2org/api/orgInfo/apply/config/isOfferPassword',
  // 设置报价管理密码
  OFFTER_PW_SET: '/aup2org/api/orgInfo/apply/config/savaUpdateOfferPassword',
  // 报价
  OFFTER_LIST: '/aup2org/api/product/offer/query',
  // 报价
  SUB_OFFTER: '/aup2org/api/product/offer/submit',
  // 报价解密
  OPEN_OFFTER: '/aup2org/api/product/offer/decrypt',
  // 报价撤回
  RECOKE_OFFTER: '/aup2org/api/product/offer/recall',
  SHOW_PRO: '/aup2org/api/project/publicityData/productDetail',
  SHOW_GROUP: '/aup2org/api/project/publicityData/groupDetail',
  SHOW_REG: '/aup2org/api/project/publicityData/registerDetail',
  // 产品列表
  PRO_LIST: '/aup2org/api/project/apply/findProApplyForPage',
  // 产品撤回
  RECOKE_PRO: '/aup2org/api/project/apply/revokeProductApply',
  // 产品删除
  DELETE_PRO: '/aup2org/api/project/apply/delete', // 竞价分组列表及选填字段信息
  TYPE_GROUP:
    '/aup2org/api/project/apply/getTypegroupAndAttibuteListByGrouptypeId',
  // 注册证配置
  TYPE_REGISTER_ID: '/aup2org/api/project/apply/getAttibuteConfigByRegisterId',
  // 获得项目token
  TOKENAPIDATA: '/portal/api/auth/tokenAddApiData',
  // project
  PROJECT_APPLY_QUERY: '/aup2org/api/project/apply/find', // 产品申报记录
  PROJECT_APPLY_DELETE: '/aup2org/api/project/apply/delete', // 删除产品申报记录
  PROJECT_APPLY_INTO: '/aup2org/api/project/apply/into', // 进入项目申报时判断是否已经申报过
  PROJECT_APPLY_CATEGORIES: '/aup2org/api/project/apply/findAll', // 用户获取产品分类
  PROJECT_APPLY_SUBMIT: '/aup2org/api/project/apply/saveOrupdate', // 企业申报数据保存/更新
  PROJECT_APPLY_DETAIL: '/aup2org/api/project/apply/detail', // 企业申报详情
  PROJECT_PRODUCT_APPLY_SUBMIT: '', // 产品提交
  PROJECT_APPLY_CANCLECHECK: '/aup2org/api/project/apply/revokeOrgInfoApply', // 撤回企业申报
  REGISTRATION_LIST: '/aup2org/api/project/apply/findRegistersForPage',
  // 注册证
  REGISTRATION_DETAIL: '/aup2org/api/project/apply/registerDetail_audit', // 注册证详情
  REGISTRATION_GROUP_DETAIL: '/aup2org/api/project/apply/pageDataSubGroup', // 组件详情
  REGISTRATION_PRODUCTADDR: '/aup2org/api/project/apply/originList', // 注册证获取产地
  REGISTRATION_MANATYPE: '/aup2org/api/project/apply/managementTypeList', // 注册证获取管理类别
  REGISTRATION_SAVEORUPDATE: '/aup2org/api/project/apply/register_saveOrUpdate', // 注册证修改或保存
  REGISTRATION_CHECK: '/aup2org/api/project/apply/submitRegisterApply', // 注册证提交审核
  REGISTRATION_CANCLECHECK: '/aup2org/api/project/apply/revokeRegisterApply', // 注册证撤回审核
  REGISTRATION_REGISTERINTO: '/aup2org/api/project/apply/register_into', // 新增注册证初始页
  REGISTRATION_REGISTERLIST: '/aup2org/api/project/apply/findRegistersForPage', // 注册证列表
  REGISTRATION_DELETE: '/aup2org/api/project/apply/deleteRegistersByIds', // 删除注册证
  // 导入文件
  DOWNLOAD_TEMPLATE: '/aup2org/api/project/apply/downLoadExcel', // 下载申报资质附件命名excel
  UPLOAD_EXCEL: '/aup2org/api/project/apply/uploadExcel', // 导入基本信息
  UPLOAD_ZIP: '/aup2org/api/project/apply/uploadZip', // 导入资质文件
  // common
  COMMON_SEND_CODE: '/portal/pub/comm/sendvcode', // 手机验证码
  COMMON_UPLOAD_IMAGE: '/portal/pub/comm/uploadimage', // 临时图片文件
  COMMON_UPLOAD_FILE: '/portal/pub/comm/uploadfile', // 临时文件,
  // 入围列表
  SHORT_LIST: '/aup2org/api/product/data/pageProductSelectAllData',
  // 入围企业列表
  ENTERPRISEENTRY_LIST: '/aup2org/api/product/data/pageOrgInfoApplyData',
  //历史报价列表
  HISTORYOFFER_LIST: '/aup2org/api/product/offer/queryHistory',
  PROJECT_ENTERPRISEENTRY_DETAIL: '/aup2org/api/project/publicityData/detail', // 企业入围公示详情
  PROJECT_APPLY_ADDDETAIL: '/aup2org/api/project/apply/addDetail',
  // 企业申报增补材料详情
  PROJECT_APPLY_SAVEORUPDATE_ADDDETAIL:
    '/aup2org/api/project/apply/saveOrupdate_addDetail', // 企业申报增补材料新增或修改
  // 用于供企业查询符合增补的产品申报记录 历史报价
  PROJECT_APPLY_ADDPRODATA: '/aup2org/api/project/apply/addProData',
  // 用于供企业查询符合增补的产品申报详情 历史报价
  PROJECT_APPLY_ADDPRODATADETAIL: '/aup2org/api/project/apply/addProDataDetail',
  // 企业符合增补的产品申报更新 历史报价
  PROJECT_APPLY_ADDPRODATAD_UPDATE:
    '/aup2org/api/project/apply/addProDataUpdate',
  FINALSELRES_LIST: '/aup2org/api/product/finalSelected/queryPublicityMy', // 最终入选结果
  FINALSELPUB_LIST: '/aup2org/api/product/finalSelected/queryPublicityAll', // 最终入选公示
  QUALITY_LIST: '/aup2org/api/codeItem/quality' // 质量层次列表
}
