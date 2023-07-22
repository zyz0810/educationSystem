import request from '@/utils/request'
import Qs from 'qs'  

// 任务内容列表
export function contentList(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 新建、编辑任务内容
export function contentAddEdit(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 任务内容--启用/禁用
export function changeUseStatus(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/changeUseStatus',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 删除任务内容
export function contentDelete(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/delete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 任务内容详情
export function contentDetail(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}


// 变更排序
export function changeSort(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/changeSort',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
