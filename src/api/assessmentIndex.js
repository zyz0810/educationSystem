import request from '@/utils/request'
import Qs from 'qs'

// 考核完成度
export function achievementList(data) {
  return request({
    url: 'api-crm-system/crm/web/v2/assessment/statistics/achievementList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 