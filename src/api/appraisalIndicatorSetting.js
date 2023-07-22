import request from '@/utils/request'
import Qs from 'qs'  

// 系统设置-考核指标设置-分页
export function settingPage(data) {
  return request({
    url: '/api-crm-system/crm/assessmentSetting/settingPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 系统设置-考核指标设置-选择任务类型
export function selectList(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type/selectList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 系统设置-考核指标设置-保存
export function saveConfig(data) {
  return request({
    url: '/api-crm-system/crm/assessmentSetting/saveConfig',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 系统设置-考核指标设置-编辑
export function updateConfig(data) {
  return request({
    url: '/api-crm-system/crm/assessmentSetting/updateConfig',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 系统设置-考核指标设置-详情
export function detail(data) {
  return request({
    url: 'api-crm-system/crm/assessmentSetting/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 系统设置-考核指标设置-日志
export function logPage(data) {
  return request({
    url: '/api-crm-system/crm/assessmentSetting/logPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 系统设置-考核指标设置-统计
export function statistical(data) {
  return request({
    url: '/api-crm-system/crm/assessmentSetting/statistical',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 