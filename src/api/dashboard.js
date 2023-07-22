import request from '@/utils/request'
import Qs from 'qs' 

// 首页数据查询
export function queryMainPageData(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryMainPageData',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询下属列表
export function getChildUsers(data) {
  return request({
    url: 'api-crm-system/crm/users/getChildUsers',
    method: 'get'
  })
}


// 业绩目标完成度:仪表盘  
export function completionEchars(data) {
  return request({
    url: 'api-crm-system/crm/performance/Statistics/completionEchars',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询绩效完成度
export function taskTarget(data) {
  return request({
    url: '/api-crm-system/crm/provider/assessment/query/task/target',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}