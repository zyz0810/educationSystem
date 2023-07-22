import request from '@/utils/request'
import Qs from 'qs'  

/* 临时任务列表接口
 *
 */ 
export function temporaryList(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task/list`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

// 新增/编辑临时任务
export function temporaryTast(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

// 删除临时任务
export function taskDelete(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

// 选择客户列表
export function selectCustomerPage(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task/selectCustomerPage`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

// 临时任务详情
export function taskDetail(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task/detail`,
    method: 'post',
    data: Qs.stringify(data)
  })
}


// 审批流程-变更状态
export function changeTaskStatus(data) {
  return request({
    url: `api-crm-system/crm/web/v2/temporary/task/changeTaskStatus`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

// 服务商列表 
export function getUsersProviderByRole (query) {
  return request({
    url: '/api-crm-system/crm/users/getUsersProviderByRole',
    method: 'get',
    params: query
  })
}