import request from '@/utils/request'
import Qs from 'qs' 

//  考核设置列表
export function assessmentPageList(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/pageList',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}


// add新增、update编辑、forbidden禁用
export function modify(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/modify',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}


// 查询明细
export function detail(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/detail',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}


// 查询服务商已设置过的月份
export function settingDate(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/query/settingDate',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 查询月份已经设置的服务商
export function settingProvider(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/query/settingProvider',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 获取服务商已有门店数量
export function queryProviderStore(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/queryProviderStore',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 查询客户数
export function queryProviderStoreV2(data) {
  return request({
      url: '/api-crm-system/crm/provider/assessment/queryProviderStore/v2',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}