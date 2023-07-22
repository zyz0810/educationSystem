import request from '@/utils/request'
import Qs from 'qs'

// 查询部门树
export function findDeptTree (query) {
  return request({
    url: '/api-crm-system/crm/dept/findDeptTree',
    method: 'get',
    params: query
  })
}

// 查询下级部门列表
export function getDepts (query) {
  return request({
    url: '/api-crm-system/crm/dept/getDepts',
    method: 'get',
    params: query
  })
} 

// 修改职务状态
export function saveOrUpdateSysDept (data) {
  return request({
    url: '/api-crm-system/crm/dept/saveOrUpdateSysDept',
    method: 'post',
    data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
  })
}

// 删除部门
export function deleteDept (data) {
  return request({
    url: '/api-crm-system/crm/dept/deleteDept',
    method: 'post',
    data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
  })
}

// 修改部门状态
export function updateEnabled (data) {
  return request({
    url: '/api-crm-system/crm/dept/updateEnabled',
    method: 'post',
    data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
  })
}