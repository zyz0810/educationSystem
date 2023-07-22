import request from '@/utils/request'
import Qs from 'qs'  

// 获取启用或者禁用的数据列表
export function getListByStatus(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/content/getListByStatus',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 任务类型列表
export function typeList(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 任务类型--启用/禁用
export function changeUseStatus(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type/changeUseStatus',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 任务类型详情
export function typeDetail(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 新建任务类型 编辑
export function taskType(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 删除任务类型
export function taskDelete(data) {
  return request({
    url: '/api-crm-system/crm/web/v2/task/type/delete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
