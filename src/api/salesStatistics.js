import request from '@/utils/request'
import Qs from 'qs'
 
// 推广商品销售业绩统计
export function queryExtensionList(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryAdvertisementProductSaleAmount',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  
 
// 服务商品销售业绩统计
export function queryServiceList(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProductSaleAmount',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  


// 服务收益商品明细
export function goodstDetail(data) {
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
export function queryOrderDetail(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleOrderDetail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 服务收益订单列表明细(改最新)
export function queryProviderSaleOrderDetailV2(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleOrderDetailV2',
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
 
// 服务商销售业绩统计Echarts
export function queryProviderSaleEcharts(data) {
  return request({
    url: '/api-crm-order/crm/providerOrder/queryProviderSaleEcharts',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}