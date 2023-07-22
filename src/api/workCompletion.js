import request from '@/utils/request'
import Qs from 'qs' 

// 服务商业绩考核目标
export function providerAssessment(data) {
  return request({
      url: '/api-crm-system/crm/performance/Statistics/providerAssessment',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 查询销售业绩详情
export function queryPermonceDetail(data) {
  return request({
      url: 'api-crm-system/crm/provider/assessment/queryPermonceDetail',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}