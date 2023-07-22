import request from '@/utils/request'
import Qs from 'qs'

// 用户查询列表
export function getRoles(query) {
  return request({
    url: '/api-crm-system/crm/role/getRoles',
    method: 'get',
    params: query
  })
}

// 删除职务
export function deleteRole(data) {
  return request({
    url: '/api-crm-system/crm/role/deleteRole',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 职务中添加人员
export function batchSaveUsersRole(data) {
  return request({
    url: '/api-crm-system/crm/role/batchSaveUsersRole',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 新增、修改职务
export function saveOrUpdateSysRole(data) {
  return request({
    url: '/api-crm-system/crm/role/saveOrUpdateSysRole',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 修改职务状态
export function updateEnabled(data) {
  return request({
    url: '/api-crm-system/crm/role/updateEnabled',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 获取职务详情
export function getRoleById(query) {
  return request({
    url: '/api-crm-system/crm/role/getRoleById',
    method: 'get',
    params: query
  })
}

// 获取职务人员列表
export function getRoleUsers(query) {
  return request({
    url: '/api-crm-system/crm/role/getRoleUsers',
    method: 'get',
    params: query
  })
}

// 设置职务权限
export function setRolePermission(data) {
  return request({
    url: '/api-crm-system/crm/role/setRolePermission',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询菜单权限树
export function findMenuTree(query) {
  return request({
    url: '/api-crm-system/crm/menu/findMenuTree',
    method: 'get',
    params: query
  })
}
