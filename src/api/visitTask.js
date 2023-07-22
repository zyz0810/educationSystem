import request from '@/utils/request'
import Qs from 'qs'

//  拜访任务列表 
export function queryVisitTask(data) {
  return request({
    url: '/api-crm-system/crm/visitTask/queryVisitTask',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 新增or编辑拜访任务
export function saveOrUpdateVisitTask(data) {
  return request({
      url: '/api-crm-system/crm/visitTask/saveOrUpdateVisitTask',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 任务详情
export function getVisitTaskDetail(query) {
  return request({  
      url: '/api-crm-system/crm/visitTask/getVisitTaskDetail',
      method: 'get',
      params: query 
  })
}

// 删除任务
export function removeVisitTask(data) {
  return request({
      url: '/api-crm-system/crm/visitTask/removeVisitTask',
      method: 'post',
      data: Qs.stringify(data, {
        arrayFormat: 'indices',
        allowDots: true
    })
  })
} 

// 取消任务
export function visitTaskCancel(data) {
  return request({
      url: '/api-crm-system/crm/visitTask/visitTaskCancel',
      method: 'post',
      data: Qs.stringify(data, {
        arrayFormat: 'indices',
        allowDots: true
    })
  })
} 

// 没有完成任务
export function visitTaskNotCompleted(data) {
  return request({
      url: '/api-crm-system/crm/visitTask/visitTaskNotCompleted',
      method: 'post',
      data: Qs.stringify(data, {
        arrayFormat: 'indices',
        allowDots: true
    })
  })
} 


// 获取完成任务所需填写的信息对象
export function getEnableFields(query) {
  return request({
    url: '/api-crm-system/crm/visitTask/getEnableFields',
    method: 'get',
    params: query
  })
}

// 完成任务
export function visitTaskDone(data) {
  return request({
      url: '/api-crm-system/crm/visitTask/visitTaskDone',
      method: 'post',
      data: Qs.stringify(data, {
        arrayFormat: 'indices',
        allowDots: true
    })
  })
} 


// 根据id查询临时信息及线索信息
export function getTempSignAndInfoById(data) {
  return request({
      url: '/api-crm-system/crm/outsideSign/getTempSignAndInfoById',
      method: 'post',
      data: Qs.stringify(data, {
        arrayFormat: 'indices',
        allowDots: true
    })
  })
} 
