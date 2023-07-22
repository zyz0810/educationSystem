import request from '@/utils/request'
import Qs from 'qs'

// 任务目标完成度列表
export function monthTaskList(data) {
  return request({
    url: 'api-crm-system/crm/web/v2/customer/monthTask/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 任务目标完成度列表合计
export function getCountAll(data) {
  return request({
    url: 'api-crm-system/crm/web/v2/customer/monthTask/getCountAll',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}