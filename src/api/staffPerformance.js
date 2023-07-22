import request from '@/utils/request'
import Qs from 'qs'

// 订单请求
export function statisticsCustomer(data) {
  return request({
    url: '/api-crm-system/crm/performance/Statistics/customer',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
 