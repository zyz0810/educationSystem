import request from '@/utils/request'
import Qs from 'qs'
 
// 办公-坐标审核-分页查询
export function coordinatesAuditPage(data) {
  return request({
    url: '/api-crm-system/crm/coordinatesAudit/page',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 办公-坐标审核-审核
export function coordinatesAuditAudit(data) {
  return request({
    url: '/api-crm-system/crm/coordinatesAudit/audit',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}