import request from '@/utils/request'
import Qs from 'qs'  
 
// 删除目标业绩结果
// export function deleteById(query) {
//   return request({
//     url: '/api-crm-system/crm/performance/deleteById',
//     method: 'get',
//     params: query
//   })
// } 

// 业绩目标完成列表
export function achievementList(data) {
  return request({
    url: 'api-crm-system/crm/performance/Statistics/achievementList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 业绩目标完成: 按照12个月排序
export function achievementByMonth(data) {
  return request({
    url: 'api-crm-system/crm/performance/Statistics/achievementByMonth',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 根据时间统计新增的订单
export function achievementByOrder(data) {
  return request({
    url: 'api-crm-system/crm/performance/Statistics/achievementByOrder',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 业绩目标完成度:echars
export function achievementByOrderEchars(data) {
  return request({
    url: 'api-crm-system/crm/performance/Statistics/achievementByOrderEchars',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}