import request from '@/utils/request'
import Qs from 'qs'  

// 查询线索列表
export function clueList(data) {
  return request({
    url: '/api-crm-system/crm/customer/clue/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
 
// 查询线索详情
export function clueDetail(data) {
  return request({
    url: '/api-crm-system/crm/customer/clue/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 线索转换客户
export function clueSwitch(data) {
  return request({
    url: '/api-crm-system/crm/customer/clue/switch',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}