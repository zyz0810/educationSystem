import request from '@/utils/request'
import Qs from 'qs' 

// 设置目标接口
export function savePerformanceQQ(data) {
  return request({
    url: 'api-crm-system/crm/performance/savePerformance',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询目标业绩结果
export function selectPerformanceList(data) {
  return request({
    url: 'api-crm-system/crm/performance/selectPerformanceList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 删除目标业绩结果
export function deleteById(query) {
  return request({
    url: '/api-crm-system/crm/performance/deleteById',
    method: 'get',
    params: query
  })
}

// 编辑目标业绩结果保存
export function updateById(data) {
  return request({
    url: 'api-crm-system/crm/performance/updateById',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 获取目标业绩详情
export function getPerformanceById(query) {
  return request({
    url: '/api-crm-system/crm/performance/getPerformanceById',
    method: 'get',
    params: query
  })
}

// 业绩目标日志
export function logPage(data) {
  return request({
    url: '/api-crm-system/crm/performance/logPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
