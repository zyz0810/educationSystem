import request from '@/utils/request'
import Qs from 'qs'
 
// 服务商销售统计
// export function listByPage(data) {
//   return request({
//     url: '/api-crm-order/crm/provider/balance/listByPage',
//     method: 'post',
//     data: Qs.stringify(data, {
//       arrayFormat: 'indices',
//       allowDots: true
//     })
//   })
// }   

// 用户查询列表
// export function getUsers(query) {
//   return request({
//     url: '/api-crm-system/crm/users/getUsers',
//     method: 'get',
//     params: query
//   })
// }

// 服务收益列表
export function queryProviderSaleAmount(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleAmount',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}   

// 商品服务销售统计
export function queryProviderSaleProductDetail(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleProductDetail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}   

// 服务收益订单明细
export function queryProviderSaleOrderDetail(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleOrderDetail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}   

// 服务收益订单详情明细(改最新)
export function queryProviderSaleProductDetailV2(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleProductDetailV2',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户经理列表
export function getSelfAndChildUsers(query) {
  return request({
    url: '/api-crm-system/crm/users/getSelfAndChildUsers',
    method: 'get',
    params: query
  })
}