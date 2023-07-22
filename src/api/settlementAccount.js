import request from '@/utils/request'
import Qs from 'qs'

// 结算单列表
export function listByPage(data) {
  return request({
    url: '/api-crm-order/crm/provider/balance/listByPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  

//申请结算
export function check(data) {
  return request({
    url: '/api-crm-order/crm/provider/balance/check',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  

//导出结算单
export function exportBalance(params) {
  return request
    .post('/api-crm-order//crm/provider/balance/exportBalance', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), {
      responseType: "blob"
    })
}


// 结算单商品明细
export function productDetail(data) {
  return request({
    url: '/api-crm-order/crm/provider/balance/product/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  

// 结算单商品明细
export function orderDetail(data) {
  return request({
    url: '/api-crm-order/crm/provider/balance/order/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

//结算单商品明细导出
export function detailExport(params) {
  return request
    .post('/api-crm-order/crm/provider/balance/product/detail/export', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), 
    {
      responseType: "blob"
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


//导出结算单明细
export function exportBalanceDetail(params) {
  return request
    .post('/api-crm-order/crm/provider/balance/export/balance/detail', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), {
      responseType: "blob"
    })
}