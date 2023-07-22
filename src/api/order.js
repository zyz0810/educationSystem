import request from '@/utils/request'
import Qs from 'qs'

// 订单请求
export function queryOrderList(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryOrderList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 订单详情
export function queryOrderDetail(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryOrderDetail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 文件导出
export function exportOrderDetail(params) {
  return request.post(
    '/api-crm-order/web/crm/order/exportOrderDetail',
    Qs.stringify(params, {
      arrayFormat: 'indices',
      allowDots: true
    }),
    {
      responseType: 'blob'
    }
  )
}
