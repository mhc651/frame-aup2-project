/**
 * Created by TIMMY on 2018/4/25.
 */
import request from '@/utils/callApi';
import constant from './api';
// 注册证
export function detail(body) {
  return request(constant.REGISTRATION_DETAIL, 'POST', body);
}
// 组件
export function groupDetail(body) {
  return request(constant.REGISTRATION_GROUP_DETAIL, 'POST', body);
}

// 产地列表
export function getOrigin(body) {
  return request(constant.REGISTRATION_PRODUCTADDR, 'POST', body);
}

// 注册证保存
export function saveRegistraction(body) {
  return request(constant.REGISTRATION_SAVEORUPDATE, 'POST', body);
}

// 注册证审核
export function submitRegisterCheck(body) {
  return request(constant.REGISTRATION_CHECK, 'POST', body);
}
// 撤回注册证审核
export function cancleRegisterCheck(body) {
  return request(constant.REGISTRATION_CANCLECHECK, 'POST', body);
}
// 撤回注册证审核
export function registerInto(body) {
  return request(constant.REGISTRATION_REGISTERINTO, 'POST', body);
}
// 注册证列表获取
export function findRegistersForPage(body) {
  return request(constant.REGISTRATION_REGISTERLIST, 'POST', body);
}
// 删除注册证
export function delteRegisters(body) {
  return request(constant.REGISTRATION_DELETE, 'POST', body);
}


